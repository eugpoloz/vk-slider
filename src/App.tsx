import React from "react";
import { Slider, RangeSlider } from './components';
import "./styles/app.css";
import "./styles/slider.css";

function App() {
  let [controlledValue, updateControlledValue] = React.useState(20);
  let [uncontrolledValue, updateUncontrolledValue] = React.useState(50);
  let [rangeValue, updateRangeValue] = React.useState([0, 50]);

  let disabledValue: number = 50;

  return (
    <article className="vk-slider-demo">
      <section className="vk-slider-demo__section">
        <h2>Контролируемый слайдер</h2>

        <div className="vk-slider-demo__information">
          <p>5-25, шаг 5</p>
          <p>Значение: <strong>{controlledValue}</strong></p>
        </div>

        <Slider
          min={5}
          max={25}
          step={5}
          value={controlledValue}
          onChange={updateControlledValue}
          ariaLabelledBy="Контролируемый слайдер"
        />
      </section>

      <hr />

      <section className="vk-slider-demo__section">
        <h2>Неконтролируемый слайдер</h2>

        <div className="vk-slider-demo__information">
          <p>0-100, шаг 1</p>
          <p>Значение: <strong>{uncontrolledValue}</strong></p>
        </div>

        <Slider
          min={0}
          max={100}
          step={1}
          defaultValue={uncontrolledValue}
          onChange={updateUncontrolledValue}
          ariaLabelledBy="Неконтролируемый слайдер"
        />
      </section>

      <hr />

      <section className="vk-slider-demo__section">
        <h2>Выключенный слайдер</h2>

        <div className="vk-slider-demo__information">
          <p>0-100, шаг 1</p>
          <p>Значение: <strong>{disabledValue}</strong></p>
        </div>

        <Slider
          min={0}
          max={100}
          step={1}
          defaultValue={disabledValue}
          disabled
          ariaLabelledBy="Выключенный слайдер"
        />
      </section>

      <hr />

      <section className="vk-slider-demo__section">
        <h2>Range-слайдер</h2>

        <div className="vk-slider-demo__information">
          <p>0-100, шаг 1</p>
          <p>Значения: <strong>[{rangeValue[0]}, {rangeValue[1]}]</strong></p>
        </div>

        <RangeSlider
          min={0}
          max={100}
          step={1}
          value={rangeValue}
          onChange={updateRangeValue}
          ariaLabelledBy="Range-слайдер"
        />
      </section>
    </article>
  );
}

export default App;
