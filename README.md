# vk-slider

Слайдер и range-слайдер на базе слайдера для ВК. Демо [здесь](https://eugpoloz.github.io/vk-slider).

Оба слайдера поддерживают mouse, touch и keyboard-ивенты, а также оформлены в соответствии с релевантной [WAI-ARIA](w3.org/TR/wai-aria-practices/#slider).

## Компоненты

### Slider

```
type SliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number,
    defaultValue?: number,
    onChange?: Function,
    disabled?: boolean,
    ariaLabelledBy?: string
};
```

Пример использования в функциональном компоненте:

```
let [value, updateValue] = React.useState(5);

return (
    <Slider
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={updateValue}
        ariaLabelledBy="Слайдер"
    />);
```

### RangeSlider

```
type RangeSliderProps = {
    min: number,
    max: number,
    step: number,
    value?: number[],
    onChange?: Function,
    disabled?: boolean,
    ariaLabelledBy?: string
};
```

Пример использования в функциональном компоненте:

```
let [value, updateValue] = React.useState([2, 5]);

return (
    <RangeSlider
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={updateValue}
        ariaLabelledBy="Range-слайдер"
    />);
```

## Заметки

Задачи оформить компоненты как отдельный готовый к деплою в NPM пакет не стояло, поэтому я ограничилась приложением-демо. 😸

В дизайне не было `:focus` и прочих им подобных состояний. Я не стала сильно с ними возиться, но немного поигралась с тенями, чтобы было видно `:hover` и `:focus`.

Что можно было бы улучшить при необходимости из того, чего тут нет:

- добавить симпатичных spring-анимаций,
- добавить rtl,
- добавить поддержку вертикального слайдера.

## Изначальная задача

Реализовать компонент Slider. Дизайн [здесь](https://www.figma.com/file/JkJtNthpXtXFzR6gVS17Ll/Test).

Условия:

- [x] есть возможность указать дискретность шага;
- [x] есть возможность указать диапазон;
- [x] поддерживаются touch и mouse события;
- [x] при ресайзе размера окна компонент продолжает корректно работать;
- [x] у компонента понятный DX. Мы специально не конкретизируем слово “понятный”. Хочется узнать, как вы понимаете этот термин;
- [x] использование TS \*
- [x] реализация RangeSlider \*

Условия со звездочкой приветствуются, но необязательны)

Результат залить на github, живой пример — на github pages.
