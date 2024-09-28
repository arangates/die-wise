import React, { createContext, useContext, useState, useEffect } from "react"
import type { DieCalculationParameters, DieCalculationResults } from "@/types"
import { calculateNewYield } from "@/lib/calculateNewYield"
import { calculateWaferParameters } from "@/lib/calculateWaferParameters"
import { countDies } from "@/lib/countDies"
import { INITIAL_PARAMETERS, INITIAL_RESULTS } from "@/pages/DieYield/constants"

interface DieYieldContextProps {
  parameters: DieCalculationParameters
  results: DieCalculationResults
  setParameters: React.Dispatch<React.SetStateAction<DieCalculationParameters>>
  resetParameters: () => void
}

const DieYieldContext = createContext<DieYieldContextProps | undefined>(undefined)

export const DieYieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parameters, setParameters] = useState<DieCalculationParameters>(INITIAL_PARAMETERS)
  const [results, setResults] = useState<DieCalculationResults>(INITIAL_RESULTS)

  useEffect(() => {
    calculateYield()
  }, [parameters])

  const calculateYield = () => {
    let newResults = { ...results }
    newResults = calculateWaferParameters(parameters, newResults)
    newResults = countDies(parameters, newResults)
    newResults = calculateNewYield(parameters, newResults)
    setResults(newResults)
  }

  const resetParameters = () => {
    setParameters(INITIAL_PARAMETERS)
  }

  return (
    <DieYieldContext.Provider value={{ parameters, results, setParameters, resetParameters }}>
      {children}
    </DieYieldContext.Provider>
  )
}

export const useDieYield = () => {
  const context = useContext(DieYieldContext)
  if (!context) {
    throw new Error("useDieYield must be used within a DieYieldProvider")
  }
  return context
}