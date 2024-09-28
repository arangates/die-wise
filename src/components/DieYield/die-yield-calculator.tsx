"use client"

import { useEffect, useState } from "react"
import type { DieCalculationParameters, DieCalculationResults } from "@/types"

import { calculateNewYield } from "@/lib/calculateNewYield"
import { calculateWaferParameters } from "@/lib/calculateWaferParameters"
import { countDies } from "@/lib/countDies"
import { isInWafer } from "@/lib/isInWafer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

    const dies = createDies(
      dieCountHorizontal,
      dieCountVertical,
      reticle,
      scale,
      centerX,
      centerY,
      radius
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
        {dies}
        <Labels size={size} />
      </svg>
    )
  }

  const createDies = (
    dieCountHorizontal: number,
    dieCountVertical: number,
    reticle: any,
    scale: number,
    centerX: number,
    centerY: number,
    radius: number
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
            centerY
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
    }
    return dies
  }

  const calculateDiePositionAndDimensions = (
    x: number,
    y: number,
    reticle: any,
    scale: number,
    centerX: number,
    centerY: number
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

  const getDieColor = (dieInWafer: number) => {
    switch (dieInWafer) {
      case 1:
        return "rgba(70,200,70,0.8)" // Good dies
      case 2:
        return "rgba(240,70,70,0.8)" // Wasted dies
      case 4:
        return "rgba(220,210,0,0.8)" // Partial dies
      default:
        return null // Skip dies outside the wafer
    }
  }

  const BackgroundGrid: React.FC<{ size: number }> = ({ size }) => (
    <>
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
    </>
  )

  const WaferOutline: React.FC<{
    centerX: number
    centerY: number
    radius: number
    exclusionRadius: number
  }> = ({ centerX, centerY, radius, exclusionRadius }) => (
    <>
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="red"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={exclusionRadius}
        stroke="green"
        strokeWidth="2"
        fill="none"
      />
    </>
  )

  const Labels: React.FC<{ size: number }> = ({ size }) => (
    <>
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
    </>
  )

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
      <Card className="flex-1">
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
            <CheckboxInput
              checked={parameters.dieCentering}
              onChange={(checked) =>
                setParameters((prev) => ({ ...prev, dieCentering: checked }))
              }
            />
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
          <ResultsDisplay results={results} parameters={parameters} />
        </CardContent>
      </Card>
    </div>
  )
}

const ParameterInputs: React.FC<{
  parameters: DieCalculationParameters
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ parameters, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <SingleInput
      label="Die Width [w] (mm)"
      name="dieSize.horizontal"
      value={parameters.dieSize.horizontal}
      onChange={onChange}
      step="0.1"
      className="border-red-500"
    />
    <SingleInput
      label="Die Height [h] (mm)"
      name="dieSize.vertical"
      value={parameters.dieSize.vertical}
      onChange={onChange}
      step="0.1"
      className="border-red-500"
    />
    <SingleInput
      label="Horizontal Scribe Lane [sh] (mm)"
      name="dieSpacing.horizontal"
      value={parameters.dieSpacing.horizontal}
      onChange={onChange}
      step="0.1"
    />
    <SingleInput
      label="Vertical Scribe Lane [sv] (mm)"
      name="dieSpacing.vertical"
      value={parameters.dieSpacing.vertical}
      onChange={onChange}
      step="0.1"
    />
  </div>
)

const SingleInput: React.FC<{
  label: string
  name: string
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  step?: string
  className?: string
}> = ({ label, name, value, onChange, step, className }) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type="number"
      value={value}
      onChange={onChange}
      step={step}
      className={className}
    />
  </div>
)

const WaferDiameterSelect: React.FC<{
  value: number
  onChange: (value: string) => void
}> = ({ value, onChange }) => (
  <div>
    <Label htmlFor="waferDiameter">Wafer Diameter (mm)</Label>
    <Select value={value.toString()} onValueChange={onChange}>
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
)

const ShiftInputs: React.FC<{
  parameters: DieCalculationParameters
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ parameters, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <SingleInput
      label="Manual wafer placement [horizontal shift]"
      name="horizontalShift"
      value={parameters.horizontalShift}
      onChange={onChange}
    />
    <SingleInput
      label="Manual wafer placement [vertical shift]"
      name="verticalShift"
      value={parameters.verticalShift}
      onChange={onChange}
    />
  </div>
)

const CheckboxInput: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id="dieCentering" checked={checked} onCheckedChange={onChange} />
    <Label htmlFor="dieCentering">
      Die Centering / Wafer Centering (check/uncheck)
    </Label>
  </div>
)

const ResultsDisplay: React.FC<{
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

export default DieYieldCalculator
