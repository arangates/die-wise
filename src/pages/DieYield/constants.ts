import type { DieCalculationParameters, DieCalculationResults } from "@/types"

export const INITIAL_PARAMETERS: DieCalculationParameters = {
  checkScribeLineWidth: false,
  checkDieSize: false,
  dieSize: { horizontal: 1.2, vertical: 1.2 },
  reticle: { vertical: 0, horizontal: 0 },
  dieSpacing: { horizontal: 0.2, vertical: 0.2 },
  waferDiameter: 100,
  edgeLoss: 5.0,
  defectDensity: 0.1,
  dieCentering: true,
  verticalShift: 0,
  horizontalShift: 0,
}

export const INITIAL_RESULTS: DieCalculationResults = {
  averageSize: 0,
  dieArea: 0,
  yieldDieArea: 0,
  maximumDiameter: 0,
  goodDevices: 0,
  partialDevices: 0,
  excludedDevices: 0,
  yield: 0,
}