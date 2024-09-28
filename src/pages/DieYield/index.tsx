"use client"

import { useDieYield } from "@/contexts/useDieYield"

import { Card, CardContent } from "@/components/ui/card"

import { ResultsDisplay } from "@/blocks/ResultsDisplay"
import { WaferMap } from "@/blocks/WaferMap"
import { YieldControls } from "@/blocks/YieldControls"

const DieYield: React.FC = () => {
  const { parameters, results } = useDieYield()

  return (
    <div className="mx-auto flex flex-col gap-8 bg-gray-100 p-6 md:flex-row">
      <Card className="flex-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <YieldControls />
            <ResultsDisplay results={results} parameters={parameters} />
          </div>
        </CardContent>
      </Card>

      <Card className="flex-auto">
        <CardContent className="p-6">
          <div className="mb-4 rounded-lg bg-white p-4">
            <WaferMap parameters={parameters} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DieYield
