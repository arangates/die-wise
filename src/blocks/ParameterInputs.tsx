import React from "react"
import { SingleInput } from "./SingleInput"
import type { DieCalculationParameters } from "@/types"

export const ParameterInputs: React.FC<{
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
    />
    <SingleInput
      label="Die Height [h] (mm)"
      name="dieSize.vertical"
      value={parameters.dieSize.vertical}
      onChange={onChange}
      step="0.1"
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
