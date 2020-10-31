import React from "react";
import { Slider, RangeSlider } from './components';
import "./styles/app.css";
import "./styles/slider.css";

function App() {
  const simpleDefaultValue = 0.1;
  const [simpleValue, updateSimpleValue] = React.useState(simpleDefaultValue);

  const [controlledValue, updateControlledValue] = React.useState(20);
  const [rangeValue, updateRangeValue] = React.useState([0, 50]);

  let disabledValue: number = 10;

  return (
    <article className="vk-slider-demo">
      <section className="vk-slider-demo__section">
        <h2>Простой слайдер (с дефолтным значением)</h2>

        <div className="vk-slider-demo__information">
          <p>0.0001-1, шаг 0.0001</p>
          <p>Дефолтное значение: <strong>{simpleDefaultValue}</strong></p>
          <p>Текущее значение: <strong>{simpleValue}</strong></p>
        </div>

        <Slider
          min={0.0001}
          max={1}
          step={0.0001}
          defaultValue={simpleDefaultValue}
          onChange={updateSimpleValue}
          ariaLabelledBy="Простой слайдер"
        />
      </section>

      <hr />

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
        <h2>Выключенный слайдер</h2>

        <div className="vk-slider-demo__information">
          <p>0-100, шаг 1</p>
          <p>Значение: <strong>{disabledValue}</strong></p>
        </div>

        <Slider
          min={0}
          max={100}
          step={10}
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
