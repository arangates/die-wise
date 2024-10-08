import type { Die, DieCalculationParameters, Point } from "@/types"
import { calculateDiePositionAndDimensions } from "./calculateDiePositionAndDimensions"
import { getDieColor } from "./getDieColor"
import { getDieStatus } from "./getDieStatus"

export const createDies = (
  dieCountHorizontal: number,
  dieCountVertical: number,
  reticle: Point,
  scale: number,
  centerX: number,
  centerY: number,
  radius: number,
  parameters: DieCalculationParameters
) => {
  const dies: Die[] = []
  for (let x = 0; x < dieCountHorizontal; x++) {
    for (let y = 0; y < dieCountVertical; y++) {
      const { diePositionX, diePositionY, dieDimensionX, dieDimensionY } =
        calculateDiePositionAndDimensions(
          x,
          y,
          reticle,
          scale,
          centerX,
          centerY,
          parameters
        )
      const dieInWafer = getDieStatus(
        diePositionX,
        diePositionY,
        dieDimensionX,
        dieDimensionY,
        radius * 2,
        radius * 2 - parameters.edgeLoss * 2 * scale
      )

      const dieColor = getDieColor(dieInWafer)
      if (dieColor) {
        dies.push({
          key: `die-${x}-${y}`,
          x: diePositionX,
          y: diePositionY,
          width: dieDimensionX,
          height: dieDimensionY,
          fill: dieColor,
        })
      }
    }
  }
  return dies
}
