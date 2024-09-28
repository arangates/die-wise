"use client"

import { useEffect, useState } from "react"
import type { DieCalculationParameters, DieCalculationResults } from "@/types"

import { calculateNewYield } from "@/lib/calculateNewYield"
import { calculateWaferParameters } from "@/lib/calculateWaferParameters"
import { countDies } from "@/lib/countDies"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { BackgroundGrid } from "./blocks/BackgroundGrid"
import { Labels } from "./blocks/Labels"
import { ParameterInputs } from "./blocks/ParameterInputs"
import { ResultsDisplay } from "./blocks/ResultsDisplay"
import { ShiftInputs } from "./blocks/ShiftInputs"
import { SingleInput } from "./blocks/SingleInput"
import { WaferDiameterSelect } from "./blocks/WaferDiameterSelect"
import { WaferOutline } from "./blocks/WaferOutline"

import { INITIAL_PARAMETERS, INITIAL_RESULTS } from "./constants"

import { createDies } from "@/lib/createDies"


const DieYieldCalculator: React.FC = () => {
  const [parameters, setParameters] =
    useState<DieCalculationParameters>(INITIAL_PARAMETERS)
  const [results, setResults] = useState<DieCalculationResults>(INITIAL_RESULTS)

  useEffect(() => {
    calculateYield()
  }, [parameters])

  useEffect(() => {
    drawWaferMap()
  }, [results])

  const calculateYield = () => {
    let newResults = { ...results }
    newResults = calculateWaferParameters(parameters, newResults)
    newResults = countDies(parameters, newResults)
    newResults = calculateNewYield(parameters, newResults)
    setResults(newResults)
  }

  const drawWaferMap = () => {
    const size = 900
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10
    const exclusionRadius =
      radius * (1 - parameters.edgeLoss / parameters.waferDiameter)

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
    const scale = size / parameters.waferDiameter

    const dies = createDies(
      dieCountHorizontal,
      dieCountVertical,
      reticle,
      scale,
      centerX,
      centerY,
      radius,
      parameters
    )

    return (
      <svg width={size} height={size} className="aspect-square w-full">
        <BackgroundGrid size={size} />
        <WaferOutline
          centerX={centerX}
          centerY={centerY}
          radius={radius}
          exclusionRadius={exclusionRadius}
        />
        {dies.map((die) => (
          <rect
            key={die.key}
            x={die.x}
            y={die.y}
            width={die.width}
            height={die.height}
            fill={die.fill}
          />
        ))}
        <Labels size={size} />
      </svg>
    )
  }


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setParameters((prev) => {
      const newParameters: any = { ...prev }
      if (name.includes(".")) {
        const [parent, child] = name.split(".")
        newParameters[parent] = {
          ...newParameters[parent],
          [child]: parseFloat(value),
        }
      } else {
        newParameters[name] = parseFloat(value)
      }
      return newParameters
    })
  }

  const handleReset = () => {
    setParameters(INITIAL_PARAMETERS)
  }

  return (
    <div className="mx-auto flex flex-col gap-8 bg-gray-100 p-6 md:flex-row">
      <Card className="flex-auto">
        <CardContent className="p-6">
          <h1 className="text-primary mb-6 text-3xl font-bold">
            DIE YIELD CALCULATOR
          </h1>

          <div className="space-y-4">
            <ParameterInputs
              parameters={parameters}
              onChange={handleInputChange}
            />
            <WaferDiameterSelect
              value={parameters.waferDiameter}
              onChange={(value) =>
                setParameters((prev) => ({
                  ...prev,
                  waferDiameter: parseInt(value),
                }))
              }
            />
            <SingleInput
              label="Edge Loss (mm)"
              name="edgeLoss"
              value={parameters.edgeLoss}
              onChange={handleInputChange}
              className="border-green-500"
            />
            <SingleInput
              label="Defect Density (#/sq.cm)"
              name="defectDensity"
              value={parameters.defectDensity}
              onChange={handleInputChange}
              className="border-green-500"
            />
            <ShiftInputs parameters={parameters} onChange={handleInputChange} />
            <Button
              onClick={handleReset}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Reset
            </Button>
            <ResultsDisplay results={results} parameters={parameters} />
          </div>
        </CardContent>
      </Card>

      <Card className="flex-auto">
        <CardContent className="p-6">
          <div className="mb-4 rounded-lg bg-white p-4">{drawWaferMap()}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DieYieldCalculator