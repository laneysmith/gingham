import { useState, useEffect, ChangeEvent } from "react";
import "./App.css";
import generateCSS from "./utils/generateCSS";
import sampleColors from "./constants/samplePalettes";
import trashIcon from "./assets/trashIcon.svg";
import CodeBlock from "./CodeBlock";

function App() {
  const [colors, setColors] = useState<string[]>(sampleColors[0]);
  const [opacity, setOpacity] = useState<number>(60);
  const [size, setSize] = useState<number>(85);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const { backgroundImage, backgroundSize } = generateCSS({
      colors,
      opacity,
      size,
    });
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = backgroundSize;
    setCode(
      `background-image: ${backgroundImage}, background-size: ${backgroundSize}`
    );
  }, [colors, size, opacity]);

  const addColor = () => setColors((prevColors) => [...prevColors, "#FFFFFF"]);
  const removeColor = (index: number) =>
    setColors((prevColors) => [
      ...prevColors.slice(0, index),
      ...prevColors.slice(index + 1),
    ]);
  const setColor = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    setColors((prevColors) => [
      ...prevColors.slice(0, index),
      event.target.value,
      ...prevColors.slice(index + 1),
    ]);
  };

  const handleChangeSize = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, min } = event.target;
    const newValue = Math.max(Number(min), Number(value));
    setSize(newValue);
  };
  const handleChangeOpacity = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, min, max } = event.target;
    const newValue = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );
    setOpacity(newValue);
  };

  return (
    <>
      <div id="controls">
        <div className="control-option">
          <label htmlFor="size">Size (px)</label>
          <input
            type="number"
            id="size"
            name="size"
            min="1"
            value={size}
            onChange={handleChangeSize}
          />
        </div>
        <div className="control-option">
          <label htmlFor="opacity">Opacity (%)</label>
          <input
            type="number"
            id="opacity"
            name="opacity"
            min="1"
            max="100"
            value={opacity}
            onChange={handleChangeOpacity}
          />
        </div>
        <button className="full-width" onClick={addColor}>
          Add Color
        </button>
        {colors.map((color, index) => {
          return (
            <div className="control-option" key={`${index}-${color}`}>
              <label>
                <input
                  type="color"
                  name="color"
                  value={color}
                  onChange={(event) => setColor(event, index)}
                />
                &nbsp; {color.toUpperCase()}
              </label>
              <button
                onClick={() => removeColor(index)}
                disabled={colors.length < 2}
                aria-label="Remove"
              >
                <img src={trashIcon} className="icon" alt="Remove" />
              </button>
            </div>
          );
        })}
        <CodeBlock code={code} />
      </div>
    </>
  );
}

export default App;
