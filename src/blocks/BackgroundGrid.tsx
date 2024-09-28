import React from "react"

export const BackgroundGrid: React.FC<{ size: number }> = ({ size }) => (
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