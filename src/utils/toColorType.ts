import { Color } from "../types";
import { v4 as uuidv4 } from "uuid";

export function colorToColorType(color: string): Color {
  return { key: uuidv4(), color };
}

export function colorListToColorTypeList(colors: string[]): Color[] {
  return colors.map((color) => colorToColorType(color));
}
