import React from "react";
import { getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue } from "../../helpers";
import "./Slider.css";

type SliderDragEvent = React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>;

type SliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number,
    defaultValue?: number,
    onChange?: Function
};

// Slider function component
function Slider({ min = 0, max = 100, step = 1, ...props }: SliderProps) {
    // get slider ref
    const sliderRef = React.useRef<HTMLDivElement>(null);

    // measure slider
    const [sliderWidth, updateSliderWidth] = React.useState(0);
    const [sliderOffsetX, updateSliderOffsetX] = React.useState(0);

    const updateSliderDimensions = () => {
        let sliderDimensions = sliderRef?.current?.getBoundingClientRect();

        if (sliderDimensions) {
            updateSliderWidth(sliderDimensions.width);
            updateSliderOffsetX(sliderDimensions.x);
        }
    };

    React.useEffect(() => {
        updateSliderDimensions();

        // todo: debounce
        window.addEventListener('resize', updateSliderDimensions);

        return () => {
            window.removeEventListener('resize', updateSliderDimensions);
        }
    }, []);

    // set values and percentages
    const determineInitialValue = () => {
        let initialValue = 0;

        if (props.value) {
            initialValue = props.value;
        } else if (props.defaultValue) {
            initialValue = props.defaultValue;
        }

        return initialValue;
    }
    const initialValue = determineInitialValue();

    const [value, setValue] = React.useState(initialValue);
    const [percent, setPercent] = React.useState(valueToPercent(initialValue, { min, max }));

    // track active move
    const [active, toggleActive] = React.useState(false);

    // handle various events
    const updateSliderPosition = (positionX?: number) => {
        if (active && positionX != null) {
            let helperProps = {
                sliderWidth, min, max, step
            };

            const absolutePosition = positionX - sliderOffsetX;
            const validAbsolutePosition = validateAbsolutePosition(absolutePosition, helperProps);
            const percentPosition = getPercentFromAbsolutePosition(validAbsolutePosition, sliderWidth);

            setPercent(validatePercent(percentPosition));
            setValue(percentToValue(percentPosition, helperProps));


            if (props.onChange) {
                props.onChange(value);
            }
        }
    }

    const getClientXFromEvent = ($event: SliderDragEvent) => {
        let $touchEvent = ($event as React.TouchEvent<HTMLElement>);
        let $mouseEvent = ($event as React.MouseEvent<HTMLElement>);

        if ($touchEvent?.touches?.[0]?.clientX) {
            return $touchEvent.touches[0].clientX;
        }

        if ($mouseEvent?.clientX) {
            return $mouseEvent.clientX;
        }

        return undefined;
    }

    const onDragStart = ($event: SliderDragEvent) => {
        // $event.preventDefault();
        $event.stopPropagation();

        const clientX = getClientXFromEvent($event);

        toggleActive(true);
        updateSliderPosition(clientX);
    }

    // drag end
    const onDragEnd = ($event: SliderDragEvent) => {
        // $event.preventDefault();
        $event.stopPropagation();

        const clientX = getClientXFromEvent($event);

        toggleActive(false);
        updateSliderPosition(clientX);
    }

    // drag move
    const onDragMove = ($event: SliderDragEvent) => {
        // $event.preventDefault();
        $event.stopPropagation();

        const clientX = getClientXFromEvent($event);

        updateSliderPosition(clientX);
    }

    return (
        <div
            ref={sliderRef}
            className="slider"
            // touch events
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
            onTouchMove={onDragMove}
            // mouse events
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onMouseMove={onDragMove}>
            <div className="slider__scale">
                <div
                    className="slider__track"
                    style={{
                        width: percent + '%'
                    }}>
                    <span
                        className={active ? 'slider__knob active' : 'slider__knob'} />
                </div>
            </div>
        </div>
    );
}

export default Slider;
