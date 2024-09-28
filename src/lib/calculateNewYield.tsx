import { DieCalculationParameters, DieCalculationResults } from "../types"

export const calculateNewYield = (
  parameters: DieCalculationParameters,
  results: DieCalculationResults
): DieCalculationResults => {
  const defectDensity = parameters.defectDensity
  let syield = 1
  if (defectDensity > 0) {
    syield = Math.pow(
      (1 - Math.exp(-(results.yieldDieArea * defectDensity))) /
        (results.yieldDieArea * defectDensity),
      2
    )
  }

  const diesPerWafer = syield * results.goodDevices
  const goodDiesPerWafer = Math.round(diesPerWafer)
  const estimatedYield = Math.round(syield * 10000) / 100

  results.goodDevices = goodDiesPerWafer
  results.yield = estimatedYield

  return results
}
