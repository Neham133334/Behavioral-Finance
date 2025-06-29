"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const fearGreedHistory = [
  { date: "2024-01-01", index: 45, label: "Neutral" },
  { date: "2024-01-08", index: 52, label: "Neutral" },
  { date: "2024-01-15", index: 58, label: "Greed" },
  { date: "2024-01-22", index: 65, label: "Greed" },
  { date: "2024-01-29", index: 72, label: "Greed" },
  { date: "2024-02-05", index: 68, label: "Greed" },
  { date: "2024-02-12", index: 75, label: "Extreme Greed" },
]

const indicators = [
  { name: "Stock Price Momentum", value: 78, weight: 20 },
  { name: "Stock Price Strength", value: 72, weight: 20 },
  { name: "Stock Price Breadth", value: 65, weight: 10 },
  { name: "Put/Call Ratio", value: 45, weight: 10 },
  { name: "Junk Bond Demand", value: 82, weight: 10 },
  { name: "Market Volatility (VIX)", value: 35, weight: 10 },
  { name: "Safe Haven Demand", value: 25, weight: 10 },
  { name: "McClellan Volume Summation", value: 70, weight: 10 },
]

const getIndexColor = (value: number) => {
  if (value <= 25) return "text-red-600"
  if (value <= 45) return "text-orange-500"
  if (value <= 55) return "text-yellow-500"
  if (value <= 75) return "text-green-500"
  return "text-red-600"
}

const getIndexLabel = (value: number) => {
  if (value <= 25) return "Extreme Fear"
  if (value <= 45) return "Fear"
  if (value <= 55) return "Neutral"
  if (value <= 75) return "Greed"
  return "Extreme Greed"
}

export function FearGreedIndex() {
  const currentIndex = 72

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Fear & Greed Index</h2>
        <p className="text-muted-foreground">
          Market sentiment indicator based on multiple behavioral and technical factors
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Fear & Greed Index</CardTitle>
            <CardDescription>Real-time market sentiment measurement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getIndexColor(currentIndex)}`}>{currentIndex}</div>
              <div className="text-xl font-semibold mt-2">{getIndexLabel(currentIndex)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Extreme Fear</span>
                <span>Extreme Greed</span>
              </div>
              <Progress value={currentIndex} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Change</p>
                <p className="text-lg font-semibold text-green-600">+7</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Change</p>
                <p className="text-lg font-semibold text-green-600">+15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Index Components</CardTitle>
            <CardDescription>Individual indicators contributing to the overall index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indicators.map((indicator, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{indicator.name}</span>
                    <span>{indicator.value}</span>
                  </div>
                  <Progress value={indicator.value} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Weight: {indicator.weight}%</span>
                    <Badge variant="outline" className="text-xs">
                      {getIndexLabel(indicator.value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fear & Greed Index Over Time</CardTitle>
          <CardDescription>Historical trend showing market sentiment cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              index: {
                label: "Fear & Greed Index",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fearGreedHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm">Index: {data.index}</p>
                          <p className="text-sm">Sentiment: {data.label}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="index" stroke="var(--color-index)" strokeWidth={3} dot={{ r: 4 }} />
                {/* Reference lines */}
                <Line type="linear" dataKey={() => 25} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} />
                <Line type="linear" dataKey={() => 75} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Implications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">High Greed Warning</p>
                <p className="text-sm text-muted-foreground">
                  Current greed levels suggest potential market correction ahead
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Contrarian Signal</p>
                <p className="text-sm text-muted-foreground">
                  High greed often precedes market pullbacks - consider defensive positioning
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Volatility Expected</p>
                <p className="text-sm text-muted-foreground">
                  VIX remains low despite high greed - volatility spike possible
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600">When Fear is High (0-25)</h4>
              <p className="text-sm text-muted-foreground">Consider buying opportunities - market often oversold</p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-600">When Neutral (25-75)</h4>
              <p className="text-sm text-muted-foreground">Normal market conditions - follow fundamental analysis</p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">When Greed is High (75-100)</h4>
              <p className="text-sm text-muted-foreground">
                Exercise caution - market may be overbought, consider taking profits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
