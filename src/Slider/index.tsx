import React from "react";
import "./Slider.css";

type SliderProps = {
    message?: string;
};

function Slider({ message }: SliderProps) {
    return (
        <>
            <input type="range" />
        </>
    );
}

export default Slider;
