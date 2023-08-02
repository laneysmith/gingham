import { useState, useEffect, ChangeEvent, useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { Color } from "./types";
import generateCSS from "./utils/generateCSS";
import randomize from "./utils/randomize";
import palettes from "./constants/palettes";
import paintRollerIcon from "./assets/paintRollerIcon.svg";
import refreshIcon from "./assets/refreshIcon.svg";
import CopyButton from "./CopyButton";
import ColorRow from "./ColorRow";
import {
  colorToColorType,
  colorListToColorTypeList,
} from "./utils/toColorType";

function App() {
  const initialColors = useMemo(
    () => colorListToColorTypeList(randomize(palettes)),
    []
  );
  const [colors, setColors] = useState<Color[]>(initialColors);
  const [opacity, setOpacity] = useState<number>(60);
  const [size, setSize] = useState<number>(85);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const { backgroundImage, backgroundSize } = generateCSS({
      colors: colors.map(({ color }) => color),
      opacity,
      size,
    });
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = backgroundSize;
    setCode(
      `background-image: ${backgroundImage}, background-size: ${backgroundSize}`
    );
  }, [colors, size, opacity]);

  const addColor = useCallback(
    () =>
      setColors((prevColors) => [...prevColors, colorToColorType("#FFFFFF")]),
    []
  );
  const removeColor = useCallback(
    (index: number) =>
      setColors((prevColors) => [
        ...prevColors.slice(0, index),
        ...prevColors.slice(index + 1),
      ]),
    []
  );
  const updateColor = useCallback(
    (event: ChangeEvent<HTMLInputElement>, index: number) => {
      setColors((prevColors: Color[]) => [
        ...prevColors.slice(0, index),
        { ...prevColors[index], color: event.target.value },
        ...prevColors.slice(index + 1),
      ]);
    },
    []
  );
  const moveColor = useCallback((dragIndex: number, hoverIndex: number) => {
    setColors((prevColors: Color[]) => {
      const newArray = [...prevColors];
      const target = newArray[dragIndex];
      const inc = hoverIndex < dragIndex ? -1 : 1;
      for (let i = dragIndex; i !== hoverIndex; i += inc) {
        newArray[i] = newArray[i + inc];
      }
      newArray[hoverIndex] = target;
      return newArray;
    });
  }, []);

  const handleChangeSize = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value, min } = event.target;
      const newValue = Math.max(Number(min), Number(value));
      setSize(newValue);
    },
    []
  );
  const handleChangeOpacity = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value, min, max } = event.target;
      const newValue = Math.max(
        Number(min),
        Math.min(Number(max), Number(value))
      );
      setOpacity(newValue);
    },
    []
  );

  const randomizePalette = useCallback(
    () => setColors(colorListToColorTypeList(randomize(palettes))),
    []
  );

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
          Add a Color&nbsp;
          <img src={paintRollerIcon} className="icon" role="presentation" />
        </button>
        <button className="full-width" onClick={randomizePalette}>
          Randomize Palette&nbsp;
          <img src={refreshIcon} className="icon" role="presentation" />
        </button>
        <DndProvider backend={HTML5Backend}>
          <ul className="unstyled-list">
            {colors.map((color, index) => {
              return (
                <ColorRow
                  key={color.key}
                  index={index}
                  color={color.color}
                  updateColor={updateColor}
                  moveColor={moveColor}
                  removeColor={removeColor}
                  disableRemove={colors.length < 2}
                />
              );
            })}
          </ul>
        </DndProvider>
        <CopyButton code={code} />
        <div className="footer">
          <a
            href="https://github.com/laneysmith/gingham"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
