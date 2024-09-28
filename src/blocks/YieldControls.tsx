import { Button } from "@/components/ui/button"
import { SingleInput } from "@/blocks/SingleInput"
import { ShiftInputs } from "@/blocks/ShiftInputs"
import { ParameterInputs } from "@/blocks/ParameterInputs"
import { WaferDiameterSelect } from "@/blocks/WaferDiameterSelect"
import { useDieYield } from "@/contexts/useDieYield"

const YieldControls: React.FC = () => {
  const { parameters, setParameters, resetParameters } = useDieYield()

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
    <>
      <WaferDiameterSelect
        value={parameters.waferDiameter}
        onChange={(value) =>
          setParameters((prev) => ({
            ...prev,
            waferDiameter: parseInt(value),
          }))
        }
      />
      <ParameterInputs parameters={parameters} onChange={handleInputChange} />

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
    </>
  )
}

export { YieldControls}
