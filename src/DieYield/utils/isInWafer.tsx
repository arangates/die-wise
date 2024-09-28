export const isInWafer = (
  diePositionX: number,
  diePositionY: number,
  dieDimensionX: number,
  dieDimensionY: number,
  waferSize: number,
  waferProductive: number
): number => {
  const centerX = waferSize / 2
  const centerY = waferSize / 2
  const radiusExternal = waferSize / 2
  const radiusInternal = waferProductive / 2

  const corners = [
    { x: diePositionX, y: diePositionY },
    { x: diePositionX + dieDimensionX, y: diePositionY },
    { x: diePositionX, y: diePositionY + dieDimensionY },
    { x: diePositionX + dieDimensionX, y: diePositionY + dieDimensionY },
  ]

  // Count corners inside the internal and external circles
  const cornersInInternal = corners.filter(
    (corner) =>
      Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2) <
      Math.pow(radiusInternal, 2)
  ).length

  const cornersInExternal = corners.filter(
    (corner) =>
      Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2) <
      Math.pow(radiusExternal, 2)
  ).length

  if (cornersInExternal === 4) {
    if (cornersInInternal === 4) return 1 // Good die
    if (cornersInInternal > 0) return 4 // Partial die
    return 2 // Wasted die
  }
  return 3 // Outside wafer
}
