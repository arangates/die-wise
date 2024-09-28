"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

import type { DieCalculationParameters, DieCalculationResults } from "@/types"

import { countDies } from "@/lib/countDies"
import { calculateWaferParameters } from "@/lib/calculateWaferParameters"
import { calculateNewYield } from "@/lib/calculateNewYield"
import { isInWafer } from "@/lib/isInWafer"


const INITIAL_PARAMETERS: DieCalculationParameters = {
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

const INITIAL_RESULTS: DieCalculationResults = {
  averageSize: 0,
  dieArea: 0,
  yieldDieArea: 0,
  maximumDiameter: 0,
  goodDevices: 0,
  partialDevices: 0,
  excludedDevices: 0,
  yield: 0,
}


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
  const size = 600
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
  const dies = []

  for (let x = 0; x < dieCountHorizontal; x++) {
    for (let y = 0; y < dieCountVertical; y++) {
      const offsetX =
        parameters.dieSpacing.horizontal * 0.5 + parameters.horizontalShift
      const offsetY =
        parameters.dieSpacing.vertical * 0.5 + parameters.verticalShift

      const diePositionX =
        centerX +
        (x - 0.5 * dieCountHorizontal) * reticle.horizontal * scale +
        offsetX * scale
      const diePositionY =
        centerY +
        (y - 0.5 * dieCountVertical) * reticle.vertical * scale +
        offsetY * scale
      const dieDimensionX = parameters.dieSize.horizontal * scale
      const dieDimensionY = parameters.dieSize.vertical * scale

      const dieInWafer = isInWafer(
        diePositionX,
        diePositionY,
        dieDimensionX,
        dieDimensionY,
        size,
        size - parameters.edgeLoss * 2 * scale
      )

      let dieColor = ""
      if (dieInWafer === 1) {
        dieColor = "rgba(70,200,70,0.8)" // Good dies
      } else if (dieInWafer === 2) {
        dieColor = "rgba(240,70,70,0.8)" // Wasted dies
      } else if (dieInWafer === 4) {
        dieColor = "rgba(220,210,0,0.8)" // Partial dies
      } else {
        continue // Skip dies outside the wafer
      }

      dies.push(
        <rect
          key={`die-${x}-${y}`}
          x={diePositionX}
          y={diePositionY}
          width={dieDimensionX}
          height={dieDimensionY}
          fill={dieColor}
        />
      )
    }
  }

  return (
    <svg width={size} height={size} className="aspect-square w-full">
      {/* Background grid */}
      {[...Array(size / 10)].map((_, i) => (
        <line
          key={`vline-${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2={size}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(size / 10)].map((_, i) => (
        <line
          key={`hline-${i}`}
          x1="0"
          y1={i * 10}
          x2={size}
          y2={i * 10}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}

      {/* Wafer outline */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="red"
        strokeWidth="2"
        fill="none"
      />

      {/* Exclusion edge */}
      <circle
        cx={centerX}
        cy={centerY}
        r={exclusionRadius}
        stroke="green"
        strokeWidth="2"
        fill="none"
      />

      {/* Dies */}
      {dies}

      {/* Labels */}
      <text x="10" y="30" fill="red" fontSize="16px" fontFamily="Arial">
        Wafer Limits
      </text>
      <text
        x={size - 120}
        y={size - 20}
        fill="green"
        fontSize="16px"
        fontFamily="Arial"
      >
        Exclusion Edge
      </text>
    </svg>
  )
}

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setParameters((previousParameters) => {
      const newParameters: any = { ...previousParameters }
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
      <Card className="flex-1">
        <CardContent className="p-6">
          <h1 className="text-primary mb-6 text-3xl font-bold">
            DIE YIELD CALCULATOR
          </h1>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dieSize.horizontal">Die Width [w] (mm)</Label>
                <Input
                  id="dieSize.horizontal"
                  name="dieSize.horizontal"
                  type="number"
                  value={parameters.dieSize.horizontal}
                  onChange={handleInputChange}
                  step="0.1"
                  className="border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="dieSize.vertical">Die Height [h] (mm)</Label>
                <Input
                  id="dieSize.vertical"
                  name="dieSize.vertical"
                  type="number"
                  value={parameters.dieSize.vertical}
                  onChange={handleInputChange}
                  step="0.1"
                  className="border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="dieSpacing.horizontal">
                  Horizontal Scribe Lane [sh] (mm)
                </Label>
                <Input
                  id="dieSpacing.horizontal"
                  name="dieSpacing.horizontal"
                  type="number"
                  value={parameters.dieSpacing.horizontal}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="dieSpacing.vertical">
                  Vertical Scribe Lane [sv] (mm)
                </Label>
                <Input
                  id="dieSpacing.vertical"
                  name="dieSpacing.vertical"
                  type="number"
                  value={parameters.dieSpacing.vertical}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="waferDiameter">Wafer Diameter (mm)</Label>
              <Select
                value={parameters.waferDiameter.toString()}
                onValueChange={(value) =>
                  setParameters((prev) => ({
                    ...prev,
                    waferDiameter: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 mm (4 in)</SelectItem>
                  <SelectItem value="150">150 mm (6 in)</SelectItem>
                  <SelectItem value="200">200 mm (8 in)</SelectItem>
                  <SelectItem value="300">300 mm (12 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edgeLoss">Edge Loss (mm)</Label>
              <Input
                id="edgeLoss"
                name="edgeLoss"
                type="number"
                value={parameters.edgeLoss}
                onChange={handleInputChange}
                step="0.01"
                className="border-green-500"
              />
            </div>

            <div>
              <Label htmlFor="defectDensity">Defect Density (#/sq.cm)</Label>
              <Input
                id="defectDensity"
                name="defectDensity"
                type="number"
                value={parameters.defectDensity}
                onChange={handleInputChange}
                step="0.01"
                className="border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horizontalShift">
                  Manual wafer placement [horizontal shift]
                </Label>
                <Input
                  id="horizontalShift"
                  name="horizontalShift"
                  type="number"
                  value={parameters.horizontalShift}
                  onChange={handleInputChange}
                  className="border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="verticalShift">
                  Manual wafer placement [vertical shift]
                </Label>
                <Input
                  id="verticalShift"
                  name="verticalShift"
                  type="number"
                  value={parameters.verticalShift}
                  onChange={handleInputChange}
                  className="border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dieCentering"
                checked={parameters.dieCentering}
                onCheckedChange={(checked) =>
                  setParameters((prev) => ({
                    ...prev,
                    dieCentering: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="dieCentering">
                Die Centering / Wafer Centering (check/uncheck)
              </Label>
            </div>

            <Button
              onClick={handleReset}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-auto">
        <CardContent className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">WAFER MAP</h2>
          <div className="mb-4 rounded-lg bg-white p-4">{drawWaferMap()}</div>

          <div className="space-y-2 text-sm">
            <p className="text-green-500">
              Defect Density {parameters.defectDensity} #/sq.cm
            </p>
            <p className="text-green-500">
              Fabrication Yield = {results.yield}%
            </p>
            <p className="text-red-500">
              Wasted Dies #{results.excludedDevices}
            </p>
            <p className="text-gray-500">
              Defective Dies #
              {results.goodDevices -
                Math.round((results.yield / 100) * results.goodDevices)}
            </p>
            <p className="text-green-500">
              Good Dies #
              {Math.round((results.yield / 100) * results.goodDevices)}
            </p>
            <p className="text-yellow-500">
              Partial Dies #{results.partialDevices}
            </p>
            <p className="font-semibold text-black">
              Max Dies Per Wafer (without defect) #{results.goodDevices}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DieYieldCalculator
