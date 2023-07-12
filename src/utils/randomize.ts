export default function randomize(list: string[][]): string[] {
  return list[Math.floor(Math.random() * list.length)];
}
