import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const SingleInput: React.FC<{
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