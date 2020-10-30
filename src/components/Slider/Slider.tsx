import React from "react";
import { getClientXFromEvent, getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue } from "../../helpers";
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
function Slider({ min = 0, max = 100, step = 1, onChange, ...props }: SliderProps) {
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
    const initialPercent = valueToPercent(initialValue, { min, max });

    const [value, setValue] = React.useState(initialValue);
    const [percent, setPercent] = React.useState(initialPercent);
    const [active, toggleActive] = React.useState(false);

    // handle onChange event on value changes
    React.useEffect(() => {
        if (!!onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    // get and update slider position
    const updateSliderPosition = React.useCallback(($event: SliderDragEvent) => {
        const clientX = getClientXFromEvent($event);

        if (clientX != null) {
            let helperProps = {
                sliderWidth, min, max, step
            };

            const absolutePosition = clientX - sliderOffsetX;
            const validAbsolutePosition = validateAbsolutePosition(absolutePosition, helperProps);
            const percentPosition = getPercentFromAbsolutePosition(validAbsolutePosition, sliderWidth);

            setPercent(validatePercent(percentPosition));
            setValue(percentToValue(percentPosition, helperProps));
        }
    }, [max, min, sliderOffsetX, sliderWidth, step]);

    const preventDefaultAndStopPropagation = React.useCallback(($event: any) => {
        if (($event as React.TouchEvent<HTMLElement>).changedTouches?.length > 1) {
            $event.preventDefault();
        }

        $event.stopPropagation();
    }, []);

    // drag move
    const onDragMove = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);
        updateSliderPosition($event);
    }, [updateSliderPosition, preventDefaultAndStopPropagation]);

    const onDragStart = ($event: SliderDragEvent) => {
        preventDefaultAndStopPropagation($event);

        toggleActive(true);
        updateSliderPosition($event);

        document.addEventListener('mousemove', onDragMove, false);
        document.addEventListener('touchmove', onDragMove, false);

        document.addEventListener('mouseup', onDragEnd, false);
        document.addEventListener('touchend', onDragEnd, false);
    }

    // drag end
    const onDragEnd = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);
        updateSliderPosition($event);
        toggleActive(false);

        document.removeEventListener('mousemove', onDragMove, false);
        document.removeEventListener('touchmove', onDragMove, false);

        setTimeout(() => {
            document.removeEventListener('mouseup', onDragEnd, false);
            document.removeEventListener('touchend', onDragEnd, false);
        }, 0)
    }, [updateSliderPosition, onDragMove, preventDefaultAndStopPropagation]);

    return (
        <div
            ref={sliderRef}
            className="slider"
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}>
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
