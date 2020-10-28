import React, { useEffect } from "react";
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

    const [value, updateValue] = React.useState(30);
    // const [active, updateActive] = React.useState(-1);

    const style: SliderStyles = {
        width: value + '%'
    }

    // measure slider
    const [sliderWidth, updateSliderWidth] = React.useState(0);
    const [sliderOffsetX, updateSliderOffsetX] = React.useState(0);
    useEffect(() => {
        let sliderDimensions = sliderRef?.current?.getBoundingClientRect();

        if (sliderDimensions) {
            updateSliderWidth(sliderDimensions.width);
            updateSliderOffsetX(sliderDimensions.x);

            console.log('useEffect => measureSlider', sliderDimensions);
        }
    }, [sliderRef]);

    // handle various events
    // const onTouchDragStart: React.TouchEventHandler = ($event: React.TouchEvent<HTMLElement>) => {
    //     console.log('onTouchDragStart', $event);

    // }

    const onMouseDragStart: React.MouseEventHandler = ($event: React.MouseEvent<HTMLElement>) => {
        console.log('onMouseDragStart', $event);
        onDragStart($event);

    }

    const onDragStart = ({ clientX }: { clientX: number }) => {
        console.log('onDragStart', { clientX });
    }

    // const onMouseUp: MouseEventHandler = ($event: React.MouseEvent<HTMLElement>) => {
    //     console.log($event.clientX);
    // }

    return (
        <>
            <p>Value: {value}</p>

            <div
                ref={sliderRef}
                // onTouchStart={onTouchDragStart}
                onMouseDown={onMouseDragStart}
                className="slider">
                <div
                    ref={trackRef}
                    className="slider__track"
                    style={style}>
                    <span className="slider__knob" />
                </div>
            </div>
        </>
    );
}

export default Slider;
