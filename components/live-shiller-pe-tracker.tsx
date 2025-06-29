"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LiveShillerPETracker() {
  const [period, setPeriod] = useState("5y")
  const [showForecasts, setShowForecasts] = useState(true)

  const { data, loading, error, lastUpdated, refetch } = useLiveData(
    `/api/shiller-pe?period=${period}&forecasts=${showForecasts}`,
    { refreshInterval: 3600000 }, // 1 hour
  )

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Less than 1h ago"
    return `${hours}h ago`
  }

  const getValuationColor = (valuation: string) => {
    if (valuation.includes("Extremely")) return "text-red-600"
    if (valuation.includes("Significantly")) return "text-red-500"
    if (valuation.includes("Moderately")) return "text-orange-500"
    if (valuation.includes("Undervalued")) return "text-green-600"
    return "text-yellow-600"
  }

  const getValuationBadge = (valuation: string) => {
    if (valuation.includes("Overvalued")) return "destructive"
    if (valuation.includes("Undervalued")) return "default"
    return "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Shiller P/E (CAPE) Tracker</h2>
          <p className="text-muted-foreground">
            Real-time cyclically adjusted price-to-earnings ratio with historical context
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1y">1Y</SelectItem>
              <SelectItem value="5y">5Y</SelectItem>
              <SelectItem value="10y">10Y</SelectItem>
              <SelectItem value="max">Max</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">Updated: {formatLastUpdated(lastUpdated)}</div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={refetch}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {data?.metadata?.dataQuality === "sample" && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Showing sample data based on historical Shiller P/E patterns. Live data integration in progress.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Current Shiller P/E</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{data.current.shillerPE}</div>
                <p className="text-xs text-muted-foreground">
                  Historical avg: {data.statistics?.historicalAverage || "16.9"}
                </p>
                <Badge variant={getValuationBadge(data.statistics?.valuation || "")} className="mt-2">
                  {data.statistics?.valuation || "Fair Value"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">S&P 500 Price</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{data.current.sp500Price?.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  {data.current.sp500ChangePercent > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={data.current.sp500ChangePercent > 0 ? "text-green-600" : "text-red-600"}>
                    {data.current.sp500ChangePercent > 0 ? "+" : ""}
                    {data.current.sp500ChangePercent}%
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Percentile Rank</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{data.statistics?.currentPercentile}th</div>
                <p className="text-xs text-muted-foreground">Since 1881</p>
                <Badge variant="outline" className="mt-2">
                  {data.statistics?.currentPercentile > 80
                    ? "Very High"
                    : data.statistics?.currentPercentile > 60
                      ? "High"
                      : data.statistics?.currentPercentile > 40
                        ? "Average"
                        : "Low"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Expected 10Y Return</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data?.forecasts ? (
              <>
                <div className="text-2xl font-bold">{data.forecasts.expectedReturns.tenYear.base}%</div>
                <p className="text-xs text-muted-foreground">
                  Range: {data.forecasts.expectedReturns.tenYear.low}% - {data.forecasts.expectedReturns.tenYear.high}%
                </p>
                <Badge variant="secondary" className="mt-2">
                  {data.forecasts.expectedReturns.tenYear.base > 6 ? "Above Average" : "Below Average"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No forecast available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historical">Historical Trend</TabsTrigger>
          <TabsTrigger value="forecasts">Return Forecasts</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shiller P/E Historical Trend</CardTitle>
              <CardDescription>Long-term valuation trends with historical average reference line</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] animate-pulse bg-gray-200 rounded"></div>
              ) : data?.historical?.data ? (
                <ChartContainer
                  config={{
                    shillerPE: {
                      label: "Shiller P/E",
                      color: "hsl(var(--chart-1))",
                    },
                    average: {
                      label: "Historical Average",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.historical.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getFullYear().toString()} />
                      <YAxis domain={[0, 50]} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                <p className="text-sm">Shiller P/E: {data.shillerPE}</p>
                                {data.sp500 && <p className="text-sm">S&P 500: {Math.round(data.sp500)}</p>}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="shillerPE"
                        stroke="var(--color-shillerPE)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <ReferenceLine
                        y={data.statistics?.historicalAverage || 16.9}
                        stroke="var(--color-average)"
                        strokeDasharray="5 5"
                        label="Historical Average"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No historical data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          {data?.forecasts ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Expected Returns</CardTitle>
                  <CardDescription>Based on current Shiller P/E valuation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(data.forecasts.expectedReturns).map(([period, returns]: [string, any]) => (
                    <div key={period} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold capitalize">{period.replace(/([A-Z])/g, " $1")}</h4>
                        <p className="text-sm text-muted-foreground">
                          Range: {returns.low}% - {returns.high}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{returns.base}%</p>
                        <Badge variant={returns.base > 6 ? "default" : "secondary"}>
                          {returns.base > 6 ? "Above Avg" : "Below Avg"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Correction Probabilities</CardTitle>
                  <CardDescription>Based on historical patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(data.forecasts.correctionProbability).map(
                    ([correction, probability]: [string, any]) => (
                      <div key={correction} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{correction.replace(/([A-Z])/g, " $1")}% Correction</h4>
                          <p className="text-sm text-muted-foreground">Next 12 months</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{probability}%</p>
                          <Badge
                            variant={probability > 50 ? "destructive" : probability > 30 ? "outline" : "secondary"}
                          >
                            {probability > 50 ? "High Risk" : probability > 30 ? "Moderate" : "Low Risk"}
                          </Badge>
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">No forecast data available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          {data?.statistics ? (
            <Card>
              <CardHeader>
                <CardTitle>Historical Statistics</CardTitle>
                <CardDescription>Shiller P/E statistical analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Current Value</span>
                      <span className="text-lg font-bold">{data.current.shillerPE}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Historical Average</span>
                      <span className="text-lg font-bold">{data.statistics.historicalAverage}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Historical Median</span>
                      <span className="text-lg font-bold">{data.statistics.historicalMedian}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Standard Deviation</span>
                      <span className="text-lg font-bold">{data.statistics.standardDeviation}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">All-Time High</span>
                      <span className="text-lg font-bold">{data.statistics.maxValue}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">All-Time Low</span>
                      <span className="text-lg font-bold">{data.statistics.minValue}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Percentile Rank</span>
                      <span className="text-lg font-bold">{data.statistics.currentPercentile}th</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Deviation from Mean</span>
                      <span
                        className={`text-lg font-bold ${data.statistics.deviationFromMean > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {data.statistics.deviationFromMean > 0 ? "+" : ""}
                        {data.statistics.deviationFromMean}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Current Valuation Assessment</h4>
                  <p className={`text-lg font-bold ${getValuationColor(data.statistics.valuation)}`}>
                    {data.statistics.valuation}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on historical Shiller P/E patterns and statistical analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">No statistical data available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
