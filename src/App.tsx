import React from "react";
import Slider from './Slider';
import "./App.css";

function App() {
  return (
    <div className="vk-slider-demo">
      <Slider
        min={1}
        max={100}
        step={1}
      />
    </div>
  );
}

export default App;
