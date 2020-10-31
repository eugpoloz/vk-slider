import React from "react";
import { getClientXFromEvent, getPercentFromAbsolutePosition, valueToPercent, validateAbsolutePosition, validatePercent, percentToValue, SliderHelperProps } from "../../helpers";
import debounce from 'lodash.debounce';
import "./RangeSlider.css";

type SliderDragEvent = React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>;

type RangeSliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number[],
    onChange?: Function,
    disabled?: boolean,
    ariaLabelledBy?: string
};

function RangeSlider({ min = 0, max = 100, step = 1, onChange, ...props }: RangeSliderProps) {
    const DEBOUNCE_EVENT_TIMEOUT: number = 300;
    const KNOB_WIDTH: number = 28;

    // get refs
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const knobStartRef = React.useRef<HTMLSpanElement>(null);
    const knobEndRef = React.useRef<HTMLSpanElement>(null);

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
    const [value, setValue] = React.useState(props?.value ? props.value : [min, max]);

    const getPercentFromValue = (value: number) => {
        return valueToPercent(value, { min, max });
    }

    // handle onChange event on value changes
    React.useEffect(() => {
        if (!!onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    // get and update slider position
    const initialTargetRef = React.useRef<HTMLSpanElement | null>(null);

    const getPercentPosition = React.useCallback((clientX: number, helperProps: SliderHelperProps) => {
        const absoluteX = validateAbsolutePosition(clientX - sliderOffsetX, helperProps);
        const percentX = getPercentFromAbsolutePosition(absoluteX, sliderWidth);

        return percentX;
    }, [sliderOffsetX, sliderWidth]);

    const updateSliderPosition = React.useCallback(($event: SliderDragEvent) => {
        const clientX = getClientXFromEvent($event);

        if (clientX != null) {
            let helperProps = {
                sliderWidth, min, max, step
            };

            let [newStartValue, newEndValue] = value;

            const percentPosition = getPercentPosition(clientX, helperProps);

            if (initialTargetRef.current === knobStartRef.current) {
                newStartValue = percentToValue(percentPosition, helperProps);
            } else if (initialTargetRef.current === knobEndRef.current) {
                newEndValue = percentToValue(percentPosition, helperProps);
            }

            setValue([newStartValue, newEndValue]);
        }
    }, [max, min, step, sliderWidth, value, sliderOffsetX, getPercentPosition]);

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

        if ($event.target === knobEndRef.current) {
            initialTargetRef.current = knobEndRef.current;
        } else {
            initialTargetRef.current = knobStartRef.current;
        }

        updateSliderPosition($event);

        document.addEventListener('mousemove', handleDragMove, false);
        document.addEventListener('touchmove', handleDragMove, false);

        document.addEventListener('mouseup', handleDragEnd, false);
        document.addEventListener('touchend', handleDragEnd, false);
    }

    const handleDragEnd = React.useCallback(($event) => {
        preventDefaultAndStopPropagation($event);

        updateSliderPosition($event);
        initialTargetRef.current = null;

        document.removeEventListener('mousemove', handleDragMove, false);
        document.removeEventListener('touchmove', handleDragMove, false);

        setTimeout(() => {
            document.removeEventListener('mouseup', handleDragEnd, false);
            document.removeEventListener('touchend', handleDragEnd, false);
        }, 0)
    }, [preventDefaultAndStopPropagation, handleDragMove, updateSliderPosition]);

    const handleKeyDown: React.KeyboardEventHandler = ($event: React.KeyboardEvent<HTMLSpanElement>) => {
        preventDefaultAndStopPropagation($event);

        // let newValue = value;

        // switch ($event.key) {
        //     case 'Home':
        //         newValue = min;
        //         break;
        //     case 'End':
        //         newValue = max;
        //         break;
        //     case 'PageUp':
        //     case 'ArrowUp':
        //     case 'ArrowRight':
        //         if (value < max) {
        //             newValue = value + step;
        //         }
        //         break;
        //     case 'PageDown':
        //     case 'ArrowDown':
        //     case 'ArrowLeft':
        //         if (value > min) {
        //             newValue = value - step;
        //         }
        //         break;
        //     default:
        //         break;
        // }

        // setValue(newValue);
        // setPercent(valueToPercent(newValue, { min, max }));
    }

    // clean up event listeners on component destroy
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
            <span className="slider__rail">
                <span
                    className="slider__track"
                    style={{
                        left: getPercentFromValue(value[0]) + '%',
                        width: getPercentFromValue(value[1] - value[0]) + '%'
                    }}
                />
            </span>

            {/* END KNOB */}
            <input
                type="hidden"
                disabled={props && props.disabled}
                value={value[1]}
            />
            <span
                ref={knobEndRef}
                tabIndex={props && props.disabled ? undefined : 0}
                role="slider"
                aria-labelledby={props && props.ariaLabelledBy}
                aria-orientation="horizontal"
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value[1]}
                onKeyDown={handleKeyDown}
                style={{
                    left: getPercentFromValue(value[1]) + '%'
                }}
                className="slider__knob"
            />
            {/* END KNOB */}

            {/* START KNOB */}
            <input
                type="hidden"
                disabled={props && props.disabled}
                value={value[0]}
            />
            <span
                ref={knobStartRef}
                tabIndex={props && props.disabled ? undefined : 0}
                role="slider"
                aria-labelledby={props && props.ariaLabelledBy}
                aria-orientation="horizontal"
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value[0]}
                onKeyDown={handleKeyDown}
                style={{
                    left: getPercentFromValue(value[0]) + '%'
                }}
                className="slider__knob"
            />
            {/* START KNOB */}
        </div>
    );
}

export default RangeSlider;
