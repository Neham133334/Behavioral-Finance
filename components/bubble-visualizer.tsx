"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const bubbleData = [
  { name: "AAPL", priceGrowth: 25, earningsGrowth: 12, marketCap: 3000, sector: "Tech" },
  { name: "MSFT", priceGrowth: 30, earningsGrowth: 15, marketCap: 2800, sector: "Tech" },
  { name: "GOOGL", priceGrowth: 22, earningsGrowth: 10, marketCap: 1800, sector: "Tech" },
  { name: "TSLA", priceGrowth: 45, earningsGrowth: 8, marketCap: 800, sector: "Auto" },
  { name: "NVDA", priceGrowth: 85, earningsGrowth: 35, marketCap: 1200, sector: "Tech" },
  { name: "META", priceGrowth: 35, earningsGrowth: 18, marketCap: 900, sector: "Tech" },
  { name: "JPM", priceGrowth: 15, earningsGrowth: 12, marketCap: 500, sector: "Finance" },
  { name: "JNJ", priceGrowth: 8, earningsGrowth: 6, marketCap: 450, sector: "Healthcare" },
  { name: "XOM", priceGrowth: 12, earningsGrowth: 25, marketCap: 400, sector: "Energy" },
  { name: "WMT", priceGrowth: 10, earningsGrowth: 8, marketCap: 480, sector: "Retail" },
]

const historicalBubbles = [
  { year: 1999, name: "Dot-com Bubble", peakPE: 45, correction: -78 },
  { year: 2007, name: "Housing Bubble", peakPE: 27, correction: -57 },
  { year: 2021, name: "Meme Stock Bubble", peakPE: 35, correction: -45 },
  { year: 2024, name: "Current Market", peakPE: 31, correction: 0 },
]

const sectorRisk = [
  { sector: "Technology", riskScore: 85, avgPE: 28, priceDeviation: 45 },
  { sector: "Healthcare", riskScore: 35, avgPE: 18, priceDeviation: 15 },
  { sector: "Finance", riskScore: 42, avgPE: 12, priceDeviation: 20 },
  { sector: "Energy", riskScore: 28, avgPE: 14, priceDeviation: 12 },
  { sector: "Consumer", riskScore: 38, avgPE: 22, priceDeviation: 18 },
]

export function BubbleVisualizer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bubble vs Fundamentals Visualizer</h2>
        <p className="text-muted-foreground">
          Identify potential asset bubbles by comparing price growth with fundamental metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bubble Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Tech sector overvalued</p>
            <Badge variant="destructive" className="mt-2">
              Monitor
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Price/Earnings Deviation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+84%</div>
            <p className="text-xs text-muted-foreground">Above historical average</p>
            <Badge variant="outline" className="mt-2">
              Elevated
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Most Overvalued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NVDA</div>
            <p className="text-xs text-muted-foreground">Price growth vs earnings</p>
            <Badge variant="secondary" className="mt-2">
              +85% vs +35%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Correction Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Probability estimate</p>
            <Badge variant="destructive" className="mt-2">
              High Risk
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scatter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scatter">Price vs Fundamentals</TabsTrigger>
          <TabsTrigger value="historical">Historical Bubbles</TabsTrigger>
          <TabsTrigger value="sectors">Sector Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="scatter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Growth vs Earnings Growth</CardTitle>
              <CardDescription>Stocks above the diagonal line may be overvalued (bubble territory)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  priceGrowth: {
                    label: "Price Growth %",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={bubbleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="earningsGrowth" name="Earnings Growth %" domain={[0, 40]} />
                    <YAxis dataKey="priceGrowth" name="Price Growth %" domain={[0, 100]} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm">Price Growth: {data.priceGrowth}%</p>
                              <p className="text-sm">Earnings Growth: {data.earningsGrowth}%</p>
                              <p className="text-sm">Sector: {data.sector}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter dataKey="priceGrowth" fill="var(--color-priceGrowth)" />
                    {/* Diagonal line representing fair value */}
                    <Line type="linear" dataKey={() => null} stroke="#888" strokeDasharray="5 5" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Market Bubbles</CardTitle>
              <CardDescription>Learn from past bubbles and their corrections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historicalBubbles.map((bubble, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{bubble.name}</h4>
                      <p className="text-sm text-muted-foreground">Peak P/E: {bubble.peakPE}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{bubble.year}</p>
                      {bubble.correction !== 0 && <Badge variant="destructive">{bubble.correction}% correction</Badge>}
                      {bubble.correction === 0 && <Badge variant="outline">Current</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sector Bubble Risk Analysis</CardTitle>
              <CardDescription>Risk assessment by market sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorRisk.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{sector.sector}</h4>
                      <p className="text-sm text-muted-foreground">
                        Avg P/E: {sector.avgPE} | Price Deviation: +{sector.priceDeviation}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Risk Score</p>
                      <Badge
                        variant={
                          sector.riskScore > 70 ? "destructive" : sector.riskScore > 40 ? "outline" : "secondary"
                        }
                      >
                        {sector.riskScore}/100
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
