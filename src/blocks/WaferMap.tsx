import { DieCalculationParameters } from "@/types"
import { createDies } from "../lib/createDies"
import { BackgroundGrid } from "@/blocks/BackgroundGrid"
import { WaferOutline } from "@/blocks/WaferOutline"
import { Labels } from "@/blocks/Labels"

export const WaferMap = ({parameters}: {parameters: DieCalculationParameters}) => {
    const size = 900
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10
    const exclusionRadius = radius * (1 - parameters.edgeLoss / parameters.waferDiameter)

    const reticle = {
      horizontal: parameters.dieSize.horizontal + parameters.dieSpacing.horizontal,
      vertical: parameters.dieSize.vertical + parameters.dieSpacing.vertical,
    }

    const dieCountHorizontal = Math.round(parameters.waferDiameter / reticle.horizontal)
    const dieCountVertical = Math.round(parameters.waferDiameter / reticle.vertical)
    const scale = size / parameters.waferDiameter

    const dies = createDies(
      dieCountHorizontal,
      dieCountVertical,
      reticle,
      scale,
      centerX,
      centerY,
      radius,
      parameters
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
        {dies.map((die) => (
          <rect
            key={die.key}
            x={die.x}
            y={die.y}
            width={die.width}
            height={die.height}
            fill={die.fill}
          />
        ))}
        <Labels size={size} />
      </svg>
    )
  }