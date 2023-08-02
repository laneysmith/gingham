export interface Color {
  key: string;
  color: string;
}

export interface DragItem extends Color {
  index: number;
  type: string;
}
