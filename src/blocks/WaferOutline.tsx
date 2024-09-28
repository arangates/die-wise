import React from "react"

export const WaferOutline: React.FC<{
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
