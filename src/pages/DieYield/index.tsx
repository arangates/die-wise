"use client"

import { useDieYield } from "@/contexts/useDieYield"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { ParameterInputs } from "@/blocks/ParameterInputs"
import { ResultsDisplay } from "@/blocks/ResultsDisplay"
import { ShiftInputs } from "@/blocks/ShiftInputs"
import { SingleInput } from "@/blocks/SingleInput"
import { WaferDiameterSelect } from "@/blocks/WaferDiameterSelect"
import { WaferMap } from "@/blocks/WaferMap"

const DieYield: React.FC = () => {
  const { parameters, results, setParameters, resetParameters } = useDieYield()


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

  return (
    <div className="mx-auto flex flex-col gap-8 bg-gray-100 p-6 md:flex-row">
      <Card className="flex-auto">
        <CardContent className="p-6">

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
              onClick={resetParameters}
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
          <div className="mb-4 rounded-lg bg-white p-4">
            <WaferMap parameters={parameters} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DieYield