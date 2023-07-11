import hexToRGBA from "./hexToRGBA";

interface GenerateCSSInput {
  colors: string[];
  opacity: number;
  size: number;
}

interface GenerateCSSOutput {
  backgroundImage: string;
  backgroundSize: string;
}

export default function generateCSS({
  colors,
  opacity,
  size,
}: GenerateCSSInput): GenerateCSSOutput {
  const colorCount = colors.length;
  const rgbaColors = colors.map((hexColor) => hexToRGBA(hexColor, opacity));
  if (colorCount < 2) {
    rgbaColors.push("transparent");
  }
  const interval = 100 / colorCount / 2;
  const intervals = (interval: number) => {
    const temp = [];
    const endTemp = [];
    for (const [index, color] of rgbaColors.entries()) {
      if (index === 0) {
        const start = 0;
        const end = interval;
        temp.push(`${color} ${start}% ${end}%`);
        endTemp.push(`${color} ${100 - interval}% 100%`);
      } else {
        const start = (2 * index - 1) * interval;
        const end = start + 2 * interval;
        temp.push(`${color} ${start}% ${end}%`);
      }
    }
    return [...temp, ...endTemp];
  };
  const generatedIntervals = intervals(interval);
  return {
    backgroundImage: `linear-gradient(0deg,
      ${generatedIntervals.join(", ")}),
      linear-gradient(90deg,
        ${generatedIntervals.join(", ")}
        )`,
    backgroundSize: Array(colorCount).fill(`${size}px ${size}px`).join(","),
  };
}
