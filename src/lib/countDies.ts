import type { DieCalculationParameters, DieCalculationResults } from "@/types"
import { getDieStatus } from "./getDieStatus"

export const countDies = (
  parameters: DieCalculationParameters,
  results: DieCalculationResults
): DieCalculationResults => {
  // Reset device counters
  results.goodDevices = 0
  results.partialDevices = 0
  results.excludedDevices = 0

  const reticle = {
    horizontal:
      parameters.dieSize.horizontal + parameters.dieSpacing.horizontal,
    vertical: parameters.dieSize.vertical + parameters.dieSpacing.vertical,
  }

  const dieCountHorizontal = Math.round(
    parameters.waferDiameter / reticle.horizontal
  )
  const dieCountVertical = Math.round(
    parameters.waferDiameter / reticle.vertical
  )

  const waferSize = parameters.waferDiameter
  const waferProductive = parameters.waferDiameter - 2 * parameters.edgeLoss

  // Iterate through all possible die positions
  for (let x = 0; x < dieCountHorizontal; x++) {
    for (let y = 0; y < dieCountVertical; y++) {
      const offsetX =
        parameters.dieSpacing.horizontal * 0.5 + parameters.horizontalShift
      const offsetY =
        parameters.dieSpacing.vertical * 0.5 + parameters.verticalShift

      const diePositionX =
        parameters.waferDiameter / 2 +
        (x - 0.5 * dieCountHorizontal) *
          (parameters.dieSize.horizontal + parameters.dieSpacing.horizontal) +
        offsetX
      const diePositionY =
        parameters.waferDiameter / 2 +
        (y - 0.5 * dieCountVertical) *
          (parameters.dieSize.vertical + parameters.dieSpacing.vertical) +
        offsetY
      const dieDimensionX = parameters.dieSize.horizontal
      const dieDimensionY = parameters.dieSize.vertical

      const diePositionInWafer = getDieStatus(
        diePositionX,
        diePositionY,
        dieDimensionX,
        dieDimensionY,
        waferSize,
        waferProductive
      )

      // Increment counters based on die position
      if (diePositionInWafer === 4) results.partialDevices++
      if (diePositionInWafer === 2) results.excludedDevices++
      if (diePositionInWafer === 1) results.goodDevices++
    }
  }

  return results
}
