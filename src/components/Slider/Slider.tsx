import React from "react";
import { getClientXFromEvent, getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue } from "../../helpers";
import "./Slider.css";
import debounce from 'lodash.debounce';

type SliderDragEvent = React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>;

type SliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number,
    defaultValue?: number,
    onChange?: Function,
    disabled?: boolean,
    ariaLabelledBy?: string
};

function Slider({ min = 0, max = 100, step = 1, onChange, ...props }: SliderProps) {
    const DEBOUNCE_EVENT_TIMEOUT = 300;

    // get slider ref
    const sliderRef = React.useRef<HTMLDivElement>(null);

    // measure slider
    const [sliderWidth, updateSliderWidth] = React.useState(0);
    const [sliderOffsetX, updateSliderOffsetX] = React.useState(0);

    const updateSliderDimensions = React.useCallback(() => {
        let sliderDimensions = sliderRef?.current?.getBoundingClientRect();

        if (sliderDimensions) {
            updateSliderWidth(sliderDimensions.width);
            updateSliderOffsetX(sliderDimensions.x);
        }
    }, []);
    const debounceUpdateSliderDimensions = debounce(updateSliderDimensions, DEBOUNCE_EVENT_TIMEOUT);

    React.useEffect(() => {
        updateSliderDimensions();

        window.addEventListener('resize', debounceUpdateSliderDimensions);

        return () => {
            window.removeEventListener('resize', debounceUpdateSliderDimensions);
        }
    }, [updateSliderDimensions, debounceUpdateSliderDimensions]);

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

    const handleDragMove = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);
        updateSliderPosition($event);
    }, [updateSliderPosition, preventDefaultAndStopPropagation]);

    const handleDragStart = ($event: SliderDragEvent) => {
        preventDefaultAndStopPropagation($event);

        toggleActive(true);
        updateSliderPosition($event);

        document.addEventListener('mousemove', handleDragMove, false);
        document.addEventListener('touchmove', handleDragMove, false);

        document.addEventListener('mouseup', handleDragEnd, false);
        document.addEventListener('touchend', handleDragEnd, false);
    }

    const handleDragEnd = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);
        updateSliderPosition($event);
        toggleActive(false);

        document.removeEventListener('mousemove', handleDragMove, false);
        document.removeEventListener('touchmove', handleDragMove, false);

        setTimeout(() => {
            document.removeEventListener('mouseup', handleDragEnd, false);
            document.removeEventListener('touchend', handleDragEnd, false);
        }, 0)
    }, [updateSliderPosition, preventDefaultAndStopPropagation, handleDragMove]);

    return (
        <div
            ref={sliderRef}
            className={props?.disabled ? "slider disabled" : "slider"}
            onMouseDown={!props?.disabled ? handleDragStart : undefined}
            onTouchStart={!props?.disabled ? handleDragStart : undefined}>
            <span className="slider__rail" />
            <span
                className="slider__track"
                style={{
                    width: percent + '%'
                }}
            />
            <input
                type="hidden"
                disabled={props?.disabled}
                value={value}
            />
            <span
                tabIndex={props?.disabled ? undefined : 0}
                role="slider"
                aria-labelledby={props?.ariaLabelledBy}
                aria-orientation="horizontal"
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value}
                // onKeyDown={handleKeyDown}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
                style={{
                    left: percent + '%'
                }}
                className={active ? 'slider__knob active' : 'slider__knob'}
            />
        </div>
    );
}

export default Slider;
