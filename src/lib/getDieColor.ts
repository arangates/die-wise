export const getDieColor = (dieInWafer: number) => {
  switch (dieInWafer) {
    case 1:
      return "hsl(var(--chart-good))" // Good dies
    case 2:
      return "hsl(var(--chart-wasted))" // Wasted dies
    case 4:
      return "hsl(var(--chart-partial))" // Partial dies
    default:
      return null // Skip dies outside the wafer
  }
}
