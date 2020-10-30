import React from "react";
import { getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue } from "../../helpers";
import "./Slider.css";

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
    const updateSliderPosition = (positionX: number) => {
        if (active) {
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

    // drag start
    const onDragStart = (positionX: number) => {
        toggleActive(true);
        updateSliderPosition(positionX);
    }

    const onTouchDragStart: React.TouchEventHandler = ($event: React.TouchEvent<HTMLElement>) => {
        $event.stopPropagation();

        if ($event.touches[0]?.clientX) {
            onDragStart($event.touches[0].clientX);
        }
    }

    const onMouseDragStart: React.MouseEventHandler = ($event: React.MouseEvent<HTMLElement>) => {
        $event.preventDefault();
        $event.stopPropagation();

        onDragStart($event.clientX);
    }

    // drag end
    const onDragEnd = (positionX: number) => {
        toggleActive(false);
        updateSliderPosition(positionX);
    }

    const onTouchDragEnd: React.TouchEventHandler = ($event: React.TouchEvent<HTMLElement>) => {
        $event.stopPropagation();

        if ($event.touches[0]?.clientX) {
            onDragEnd($event.touches[0].clientX);
        }
    }

    const onMouseDragEnd: React.MouseEventHandler = ($event: React.MouseEvent<HTMLElement>) => {
        $event.preventDefault();
        $event.stopPropagation();

        onDragEnd($event.clientX);
    }

    // drag move
    const onTouchDragMove: React.TouchEventHandler = ($event: React.TouchEvent<HTMLElement>) => {
        $event.stopPropagation();

        if ($event.touches[0]?.clientX) {
            let positionX = $event.touches[0].clientX;

            updateSliderPosition(positionX);
        }
    }

    const onMouseDragMove: React.MouseEventHandler = ($event: React.MouseEvent<HTMLElement>) => {
        $event.preventDefault();
        $event.stopPropagation();

        updateSliderPosition($event.clientX);
    }

    return (
        <div
            ref={sliderRef}
            // touch events
            onTouchStart={onTouchDragStart}
            onTouchEnd={onTouchDragEnd}
            // mouse events
            onMouseDown={onMouseDragStart}
            onMouseUp={onMouseDragEnd}
            onMouseMove={onMouseDragMove}
            className="slider">
            <div className="slider__scale">
                <div
                    className="slider__track"
                    style={{
                        width: percent + '%'
                    }}>
                    <span
                        onTouchMove={onTouchDragMove}
                        className={active ? 'slider__knob active' : 'slider__knob'} />
                </div>
            </div>
        </div>
    );
}

export default Slider;
