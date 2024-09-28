export const getDieColor = (dieInWafer: number) => {
  switch (dieInWafer) {
    case 1:
      return "rgba(70,200,70,0.8)" // Good dies
    case 2:
      return "rgba(240,70,70,0.8)" // Wasted dies
    case 4:
      return "rgba(220,210,0,0.8)" // Partial dies
    default:
      return null // Skip dies outside the wafer
  }
}
