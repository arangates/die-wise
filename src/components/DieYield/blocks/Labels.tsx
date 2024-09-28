import React from "react"

export const Labels: React.FC<{ size: number }> = ({ size }) => (
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