export const DEBOUNCE_EVENT_TIMEOUT: number = 300;
export const STEP_INCREMENT: number = 10;

export function getClientXFromEvent(
    $event: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
) {
    let $touchEvent = $event as React.TouchEvent<HTMLElement>;
    let $mouseEvent = $event as React.MouseEvent<HTMLElement>;

    if ($touchEvent?.touches?.[0]?.clientX) {
        return $touchEvent.touches[0].clientX;
    }

    if ($mouseEvent?.clientX) {
        return $mouseEvent.clientX;
    }

    return undefined;
}

export type SliderHelperProps = {
    min: number;
    max: number;
    step: number;
    sliderWidth: number;
};
export function validateAbsolutePosition(
    position: number,
    { sliderWidth, min, max, step }: SliderHelperProps
) {
    let validPosition = Math.max(0, Math.min(position, sliderWidth));

    if (step > 0) {
        const stepCount = (max - min) / step;
        const absStep = sliderWidth / stepCount;

        validPosition = Math.round(validPosition / absStep) * absStep;
    }

    return validPosition;
}

export function validatePercent(percent: number): number {
    return Math.max(0, Math.min(percent, 100));
}

export function getPercentFromAbsolutePosition(
    position: number,
    sliderWidth: number
) {
    return (position * 100) / sliderWidth;
}

function precisionRound(number: number, precision: number) {
    let factor = Math.pow(10, precision || 1);
    return Math.round(number * factor) / factor;
}

export function clampValue(value: number, step: number) {
    if (step > 0) {
        const stepFloatPart = `${step}`.split(".")[1] || "";
        return precisionRound(value, stepFloatPart.length);
    }

    return value;
}

type PercentToValueProps = { min: number; max: number; step: number };
export function percentToValue(
    percent: number,
    { min, max, step }: PercentToValueProps
) {
    const value = (percent * (max - min)) / 100 + min;

    return clampValue(value, step);
}

type ValueToPercentProps = { min: number; max: number };
export function valueToPercent(
    value: number,
    { min, max }: ValueToPercentProps
) {
    return ((value - min) * 100) / (max - min);
}
