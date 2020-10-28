import React from "react";
import "./Slider.css";

type SliderProps = {
    min: number,
    max: number,
    step: number
};

function Slider({ min = 0, max = 100, step = 1 }: SliderProps) {
    const [value, useValue] = React.useState(30);

    const style = {
        width: value + '%'
    }

    return (
        <div className="slider">
            <div className="slider__track" style={style}>
                <div className="slider__knob"></div>
            </div>
        </div>
    );
}

export default Slider;
