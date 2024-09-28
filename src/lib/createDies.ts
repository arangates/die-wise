import type { DieCalculationParameters } from "@/types"
import { calculateDiePositionAndDimensions } from "./calculateDiePositionAndDimensions"
import { getDieColor } from "./getDieColor"
import { isInWafer } from "./isInWafer"

  export const createDies = (
    dieCountHorizontal: number,
    dieCountVertical: number,
    reticle: any,
    scale: number,
    centerX: number,
    centerY: number,
    radius: number,
    parameters: DieCalculationParameters
  ) => {
    const dies = []
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
        const dieInWafer = isInWafer(
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
            fill: dieColor
          })
        }
      }
    }
    return dies
  }