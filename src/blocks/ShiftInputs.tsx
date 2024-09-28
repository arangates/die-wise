import React from "react"
import { SingleInput } from "./SingleInput"
import type { DieCalculationParameters } from "@/types"

export const ShiftInputs: React.FC<{
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
