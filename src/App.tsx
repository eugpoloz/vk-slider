import React from "react";
import Slider from './Slider';
import "./App.css";

function App() {
  let [sliderValue, updateSliderValue] = React.useState(15);

  return (
    <div className="vk-slider-demo">
      <h2>Controlled Slider: {sliderValue}</h2>

      <Slider
        min={0}
        max={50}
        step={1}
        value={sliderValue}
        onChange={updateSliderValue}
      />

      <hr />

      <h2>Uncontrolled Slider</h2>

      <Slider
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}

export default App;
