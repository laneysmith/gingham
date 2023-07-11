export default function hexToRGBA(hex: string, opacity: number): string {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const expandedHex = hex.replace(
    shorthandRegex,
    function (_, r, g, b): string {
      return `${r}${r}${g}${g}${b}${b}`;
    }
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }
  return `rgba(255, 255, 255, ${opacity / 100})`;
}
