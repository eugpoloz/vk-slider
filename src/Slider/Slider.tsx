import React from "react";
import "./Slider.css";

type SliderProps = {
    min: number,
    max: number,
    step: number
};

type SliderStyles = {
    width: string
}

function Slider({ min = 0, max = 100, step = 1 }: SliderProps) {
    // set initial refs
    const trackRef = React.useRef<HTMLDivElement>(null);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const [value, setValue] = React.useState(0);
    const [active, toggleActive] = React.useState(false);

    const style: SliderStyles = {
        width: value + '%'
    }

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

    // register helpers
    const validateAbsolutePosition = (position: number) => {
        let res = Math.max(0, Math.min(position, sliderWidth));

        if (step > 0) {
            const stepCount = (max - min) / step;
            const absStep = sliderWidth / stepCount;

            res = Math.round(res / absStep) * absStep;
        }

        // console.log('validatePosition', res);

        return res;
    }

    // const validatePercent = (percent: number) => {
    //     return Math.max(0, Math.min(percent, 100));
    // }

    const getPercentFromAbsolutePosition = (position: number) => {
        return position * 100 / sliderWidth;
    }

    const precisionRound = (number: number, precision: number) => {
        let factor = Math.pow(10, precision || 1);
        return Math.round(number * factor) / factor;
    }

    const percentToValue = (percent: number) => {
        const res = percent * (max - min) / 100 + min;

        if (step > 0) {
            const stepFloatPart = `${step}`.split('.')[1] || '';
            return precisionRound(res, stepFloatPart.length);
        }

        return res;
    }

    // const valueToPercent = (value: number) => {
    //     return (value - min) * 100 / (max - min);
    // }

    // handle various events
    // const onTouchDragStart: React.TouchEventHandler = ($event: React.TouchEvent<HTMLElement>) => {
    //     console.log('onTouchDragStart', $event);

    // }

    const updateSliderPosition = (positionX: number) => {
        if (active) {
            const absolutePosition = validateAbsolutePosition(positionX - sliderOffsetX);
            const percentPosition = getPercentFromAbsolutePosition(absolutePosition);

            setValue(percentToValue(percentPosition));
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
        <>
            <p>Value: {value}</p>

            <div
                ref={sliderRef}
                onTouchStart={onTouchDragStart}
                onTouchEnd={onTouchDragEnd}
                onMouseDown={onMouseDragStart}
                onMouseUp={onMouseDragEnd}
                onMouseOut={onMouseDragEnd}
                className="slider">
                <div
                    ref={trackRef}
                    className="slider__track"
                    style={style}>
                    <span
                        onTouchMove={onTouchDragMove}
                        onMouseMove={onMouseDragMove}
                        className="slider__knob" />
                </div>
            </div>
        </>
    );
}

export default Slider;
