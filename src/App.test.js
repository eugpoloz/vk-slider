import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders sliders", () => {
  render(<App />);

  const controlled = screen.getByText(/^Контролируемый слайдер$/i);
  expect(controlled).toBeInTheDocument();

  const uncontrolled = screen.getByText(/^Неконтролируемый слайдер$/i);
  expect(uncontrolled).toBeInTheDocument();

  const disabled = screen.getByText(/^Выключенный слайдер$/i);
  expect(disabled).toBeInTheDocument();

  const range = screen.getByText(/^Range-слайдер$/i);
  expect(range).toBeInTheDocument();
});
