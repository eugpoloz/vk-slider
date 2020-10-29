import React from "react";
import "./Slider.css";

type SliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number,
    defaultValue?: number,
    onChange?: Function
};

// helper functions
type SliderHelperProps = {
    min: number,
    max: number,
    step: number,
    sliderWidth: number
}
function validateAbsolutePosition(position: number, { sliderWidth, min, max, step }: SliderHelperProps) {
    let validPosition = Math.max(0, Math.min(position, sliderWidth));

    if (step > 0) {
        const stepCount = (max - min) / step;
        const absStep = sliderWidth / stepCount;

        validPosition = Math.round(validPosition / absStep) * absStep;
    }

    return validPosition;
}

function validatePercent(percent: number): number {
    return Math.max(0, Math.min(percent, 100));
}

function getPercentFromAbsolutePosition(position: number, { sliderWidth }: SliderHelperProps) {
    return position * 100 / sliderWidth;
}

function precisionRound(number: number, precision: number) {
    let factor = Math.pow(10, precision || 1);
    return Math.round(number * factor) / factor;
}

function percentToValue(percent: number, { sliderWidth, min, max, step }: SliderHelperProps) {
    const res = percent * (max - min) / 100 + min;

    if (step > 0) {
        const stepFloatPart = `${step}`.split('.')[1] || '';
        return precisionRound(res, stepFloatPart.length);
    }

    return res;
}

type ValueToPercentProps = { min: number, max: number };
function valueToPercent(value: number, { min, max }: ValueToPercentProps) {
    return (value - min) * 100 / (max - min);
}

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

            console.log('updateSliderDimensions', sliderDimensions);
        }
    };

    React.useEffect(() => {
        updateSliderDimensions();

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
            const percentPosition = getPercentFromAbsolutePosition(validAbsolutePosition, helperProps);

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
