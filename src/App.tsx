import DieYield from "@/pages/DieYield"
import { DieYieldProvider } from "@/contexts/useDieYield"

function App() {
  return (
    <DieYieldProvider>
      <DieYield />
    </DieYieldProvider>
  )
}

export default App
