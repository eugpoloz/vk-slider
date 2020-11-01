import React from "react";
import { getClientXFromEvent, getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue, DEBOUNCE_EVENT_TIMEOUT, STEP_INCREMENT } from "../../helpers";
import debounce from 'lodash.debounce';

type SliderDragEvent = React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>;

type SliderProps = {
    min: number,
    max: number,
    step?: number,
    value?: number,
    defaultValue?: number,
    onChange?: Function,
    disabled?: boolean,
    ariaLabelledBy?: string
};

function Slider({ min = 0, max = 100, step = 0.01, onChange, ...props }: SliderProps) {
    // get refs
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const knobRef = React.useRef<HTMLSpanElement>(null);

    // measure slider
    const [sliderWidth, updateSliderWidth] = React.useState<number>(0);
    const [sliderOffsetX, updateSliderOffsetX] = React.useState<number>(0);

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

    const [value, setValue] = React.useState<number>(initialValue);
    const [percent, setPercent] = React.useState<number>(initialPercent);
    const [active, toggleActive] = React.useState<boolean>(false);

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

    // handle events
    const handleDragMove = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);
        updateSliderPosition($event);
    }, [updateSliderPosition, preventDefaultAndStopPropagation]);

    const handleDragStart = ($event: SliderDragEvent) => {
        preventDefaultAndStopPropagation($event);

        knobRef.current?.focus();
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
        knobRef.current?.blur();

        document.removeEventListener('mousemove', handleDragMove, false);
        document.removeEventListener('touchmove', handleDragMove, false);

        setTimeout(() => {
            document.removeEventListener('mouseup', handleDragEnd, false);
            document.removeEventListener('touchend', handleDragEnd, false);
        }, 0)
    }, [updateSliderPosition, preventDefaultAndStopPropagation, handleDragMove]);

    const handleKeyDown: React.KeyboardEventHandler = ($event: React.KeyboardEvent<HTMLSpanElement>) => {
        preventDefaultAndStopPropagation($event);

        let newValue = value;

        switch ($event.key) {
            case 'Home':
                newValue = min;
                break;
            case 'End':
                newValue = max;
                break;
            case 'PageUp':
                let updatedIncrementedValue = value + step * STEP_INCREMENT;

                if (updatedIncrementedValue < max) {
                    newValue = updatedIncrementedValue;
                } else {
                    newValue = max;
                }
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                if (value < max) {
                    newValue = value + step;
                }
                break;
            case 'PageDown':
                let updatedDecrementedValue = value - step * STEP_INCREMENT;

                if (updatedDecrementedValue > min) {
                    newValue = updatedDecrementedValue;
                } else {
                    newValue = min;
                }
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                if (value > min) {
                    newValue = value - step;
                }
                break;
            default:
                break;
        }

        setValue(newValue);
        setPercent(valueToPercent(newValue, { min, max }));
    }

    // clean up event listeners on component destroy (= componentWillUnmount)
    React.useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleDragMove, false);
            document.removeEventListener('touchmove', handleDragMove, false);

            document.removeEventListener('mouseup', handleDragEnd, false);
            document.removeEventListener('touchend', handleDragEnd, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={sliderRef}
            className={(props && props.disabled) ? "slider disabled" : "slider"}
            onMouseDown={!(props && props.disabled) ? handleDragStart : undefined}
            onTouchStart={!(props && props.disabled) ? handleDragStart : undefined}>
            <span className="slider__rail" />
            <span
                className="slider__track"
                style={{
                    width: percent + '%'
                }}
            />
            <input
                type="hidden"
                disabled={props && props.disabled}
                value={value}
            />
            <span
                ref={knobRef}
                tabIndex={props && props.disabled ? undefined : 0}
                role="slider"
                aria-labelledby={props && props.ariaLabelledBy}
                aria-orientation="horizontal"
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value}
                onKeyDown={handleKeyDown}
                style={{
                    left: percent + '%'
                }}
                className={active ? 'slider__knob active' : 'slider__knob'}
            />
        </div>
    );
}

export default Slider;
