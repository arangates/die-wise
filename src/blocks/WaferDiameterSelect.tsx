import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export const WaferDiameterSelect: React.FC<{
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