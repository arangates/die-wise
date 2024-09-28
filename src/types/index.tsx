export type Point = { vertical: number; horizontal: number }
export type DieCalculationParameters = {
  checkScribeLineWidth: boolean
  checkDieSize: boolean
  dieSize: Point
  reticle: Point
  dieSpacing: Point
  waferDiameter: number
  edgeLoss: number
  defectDensity: number
  dieCentering: boolean
  verticalShift: number
  horizontalShift: number
}
export type DieCalculationResults = {
  averageSize: number
  dieArea: number
  yieldDieArea: number
  maximumDiameter: number
  goodDevices: number
  partialDevices: number
  excludedDevices: number
  yield: number
}

export type Die = {
  key: string
  x: number
  y: number
  width: number
  height: number
  fill: string
}
