// helper functions
export type SliderHelperProps = {
    min: number,
    max: number,
    step: number,
    sliderWidth: number
}
export function validateAbsolutePosition(position: number, { sliderWidth, min, max, step }: SliderHelperProps) {
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

export function getPercentFromAbsolutePosition(position: number, sliderWidth: number) {
    return position * 100 / sliderWidth;
}

export function precisionRound(number: number, precision: number) {
    let factor = Math.pow(10, precision || 1);
    return Math.round(number * factor) / factor;
}

export function percentToValue(percent: number, { sliderWidth, min, max, step }: SliderHelperProps) {
    const res = percent * (max - min) / 100 + min;

    if (step > 0) {
        const stepFloatPart = `${step}`.split('.')[1] || '';
        return precisionRound(res, stepFloatPart.length);
    }

    return res;
}

type ValueToPercentProps = { min: number, max: number };
export function valueToPercent(value: number, { min, max }: ValueToPercentProps) {
    return (value - min) * 100 / (max - min);
}