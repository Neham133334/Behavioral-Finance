"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const shillerPEHistory = [
  { year: 1990, shillerPE: 15.2, normalPE: 14.8, sp500: 330 },
  { year: 1995, shillerPE: 20.1, normalPE: 18.2, sp500: 615 },
  { year: 2000, shillerPE: 44.2, normalPE: 29.1, sp500: 1469 },
  { year: 2005, shillerPE: 26.4, normalPE: 19.8, sp500: 1248 },
  { year: 2007, shillerPE: 27.2, normalPE: 22.4, sp500: 1468 },
  { year: 2009, shillerPE: 15.2, normalPE: 13.1, sp500: 1115 },
  { year: 2015, shillerPE: 24.8, normalPE: 20.1, sp500: 2043 },
  { year: 2020, shillerPE: 32.1, normalPE: 28.2, sp500: 3756 },
  { year: 2024, shillerPE: 31.2, normalPE: 26.8, sp500: 4800 },
]

const valuationMetrics = [
  { metric: "Current Shiller P/E", value: 31.2, historical: 16.9, status: "Overvalued" },
  { metric: "Normal P/E Ratio", value: 26.8, historical: 15.8, status: "Overvalued" },
  { metric: "Price-to-Book", value: 4.2, historical: 2.8, status: "Overvalued" },
  { metric: "Price-to-Sales", value: 2.8, historical: 1.6, status: "Overvalued" },
  { metric: "Dividend Yield", value: 1.4, historical: 2.1, status: "Low" },
]

const marketCycles = [
  { period: "1990-2000", type: "Bull Market", shillerPEStart: 15.2, shillerPEEnd: 44.2, return: 315 },
  { period: "2000-2009", type: "Bear/Recovery", shillerPEStart: 44.2, shillerPEEnd: 15.2, return: -24 },
  { period: "2009-2020", type: "Bull Market", shillerPEStart: 15.2, shillerPEEnd: 32.1, return: 237 },
  { period: "2020-2024", type: "Current", shillerPEStart: 32.1, shillerPEEnd: 31.2, return: 28 },
]

export function ShillerPETracker() {
  const currentShillerPE = 31.2
  const historicalAverage = 16.9

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shiller P/E (CAPE) Tracker</h2>
        <p className="text-muted-foreground">
          Cyclically Adjusted Price-to-Earnings ratio for long-term market valuation analysis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Current Shiller P/E</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31.2</div>
            <p className="text-xs text-muted-foreground">vs Historical avg: 16.9</p>
            <Badge variant="destructive" className="mt-2">
              Overvalued
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Percentile Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89th</div>
            <p className="text-xs text-muted-foreground">Since 1881</p>
            <Badge variant="outline" className="mt-2">
              High
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">Next 10 years (annualized)</p>
            <Badge variant="secondary" className="mt-2">
              Below Average
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Correction Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Based on historical patterns</p>
            <Badge variant="destructive" className="mt-2">
              Monitor
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historical">Historical Trend</TabsTrigger>
          <TabsTrigger value="valuation">Valuation Metrics</TabsTrigger>
          <TabsTrigger value="cycles">Market Cycles</TabsTrigger>
        </TabsList>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shiller P/E Historical Trend</CardTitle>
              <CardDescription>Long-term valuation trends with market context</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  shillerPE: {
                    label: "Shiller P/E",
                    color: "hsl(var(--chart-1))",
                  },
                  normalPE: {
                    label: "Normal P/E",
                    color: "hsl(var(--chart-2))",
                  },
                  average: {
                    label: "Historical Average",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={shillerPEHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[10, 50]} />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{label}</p>
                              <p className="text-sm">Shiller P/E: {data.shillerPE}</p>
                              <p className="text-sm">Normal P/E: {data.normalPE}</p>
                              <p className="text-sm">S&P 500: {data.sp500}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line type="monotone" dataKey="shillerPE" stroke="var(--color-shillerPE)" strokeWidth={3} />
                    <Line
                      type="monotone"
                      dataKey="normalPE"
                      stroke="var(--color-normalPE)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    {/* Historical average line */}
                    <Line
                      type="linear"
                      dataKey={() => historicalAverage}
                      stroke="var(--color-average)"
                      strokeDasharray="3 3"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Valuation Metrics</CardTitle>
              <CardDescription>Multiple valuation measures compared to historical averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {valuationMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{metric.metric}</h4>
                      <p className="text-sm text-muted-foreground">Historical Average: {metric.historical}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{metric.value}</p>
                      <Badge
                        variant={
                          metric.status === "Overvalued"
                            ? "destructive"
                            : metric.status === "Low"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valuation Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Historically Expensive</p>
                  <p className="text-sm text-muted-foreground">Current Shiller P/E is 85% above historical average</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Low Expected Returns</p>
                  <p className="text-sm text-muted-foreground">
                    High valuations typically lead to below-average future returns
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Mean Reversion Risk</p>
                  <p className="text-sm text-muted-foreground">
                    Markets tend to revert to long-term valuation averages over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Cycles & Shiller P/E</CardTitle>
              <CardDescription>How valuation cycles relate to market performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketCycles.map((cycle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{cycle.period}</h4>
                      <p className="text-sm text-muted-foreground">
                        Shiller P/E: {cycle.shillerPEStart} → {cycle.shillerPEEnd}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {cycle.type}
                      </Badge>
                      <p className={`text-lg font-bold ${cycle.return > 0 ? "text-green-600" : "text-red-600"}`}>
                        {cycle.return > 0 ? "+" : ""}
                        {cycle.return}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shiller's Investment Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Long-term Perspective</h4>
                <p className="text-sm text-muted-foreground">
                  CAPE ratio is most useful for predicting returns over 10+ year periods
                </p>
              </div>
              <div>
                <h4 className="font-medium">Market Timing Limitations</h4>
                <p className="text-sm text-muted-foreground">
                  High valuations can persist longer than expected - timing is difficult
                </p>
              </div>
              <div>
                <h4 className="font-medium">Behavioral Factors</h4>
                <p className="text-sm text-muted-foreground">
                  Investor psychology and narratives can drive valuations beyond fundamentals
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
