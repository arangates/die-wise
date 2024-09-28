import React from "react"
import type { DieCalculationParameters, DieCalculationResults } from "@/types"

export const ResultsDisplay: React.FC<{
  results: DieCalculationResults
  parameters: DieCalculationParameters
}> = ({ results, parameters }) => (
  <div className="space-y-2 text-sm">
    <p className="text-green-500">
      Defect Density {parameters.defectDensity} #/sq.cm
    </p>
    <p className="text-green-500">Fabrication Yield = {results.yield}%</p>
    <p className="text-red-500">Wasted Dies #{results.excludedDevices}</p>
    <p className="text-gray-500">
      Defective Dies #
      {results.goodDevices -
        Math.round((results.yield / 100) * results.goodDevices)}
    </p>
    <p className="text-green-500">
      Good Dies #{Math.round((results.yield / 100) * results.goodDevices)}
    </p>
    <p className="text-yellow-500">Partial Dies #{results.partialDevices}</p>
    <p className="font-semibold text-black">
      Max Dies Per Wafer (without defect) #{results.goodDevices}
    </p>
  </div>
)