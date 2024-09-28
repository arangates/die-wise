import type { DieCalculationParameters } from "@/types"

export const calculateDiePositionAndDimensions = (
  x: number,
  y: number,
  reticle: any,
  scale: number,
  centerX: number,
  centerY: number,
  parameters: DieCalculationParameters
) => {
  const offsetX =
    parameters.dieSpacing.horizontal * 0.5 + parameters.horizontalShift
  const offsetY =
    parameters.dieSpacing.vertical * 0.5 + parameters.verticalShift

  const diePositionX =
    centerX +
    (x - 0.5 * Math.round(parameters.waferDiameter / reticle.horizontal)) *
      reticle.horizontal *
      scale +
    offsetX * scale
  const diePositionY =
    centerY +
    (y - 0.5 * Math.round(parameters.waferDiameter / reticle.vertical)) *
      reticle.vertical *
      scale +
    offsetY * scale
  const dieDimensionX = parameters.dieSize.horizontal * scale
  const dieDimensionY = parameters.dieSize.vertical * scale

  return { diePositionX, diePositionY, dieDimensionX, dieDimensionY }
}
