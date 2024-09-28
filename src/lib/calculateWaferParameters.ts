import type { DieCalculationParameters, DieCalculationResults } from "../types"

export const calculateWaferParameters = (
  parameters: DieCalculationParameters,
  results: DieCalculationResults
): DieCalculationResults => {
  // Calculate average size, die area, yield die area, and maximum diameter
  results.averageSize =
    Math.sqrt(parameters.dieSize.vertical * parameters.dieSize.horizontal) +
    parameters.dieSpacing.vertical +
    parameters.dieSpacing.horizontal
  results.dieArea = Math.pow(results.averageSize, 2)
  results.yieldDieArea =
    parameters.dieSize.vertical * parameters.dieSize.horizontal * 0.01
  results.maximumDiameter = parameters.waferDiameter - 2 * parameters.edgeLoss
  return results
}
