// normalized device coordinates (NDC) conversion for 2D coordinates
export function convertCoordsToNdc2D(
  x: number,
  y: number,
  width: number,
  height: number
): [number, number] {
  // Convert coordinates from left-top origin to NDC (Normalized Device Coordinates)
  const ndcX = (x / width) * 2 - 1; // Convert to range [-1, 1]
  const ndcY = -((y / height) * 2 - 1); // Invert Y axis for NDC
  return [ndcX, ndcY];
}
