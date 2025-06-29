"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, TrendingUp, TrendingDown, BarChart3, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SentimentMarketCorrelation() {
  const [period, setPeriod] = useState("6m")
  const [metric, setMetric] = useState("sp500")
  const [platform, setPlatform] = useState("combined")

  const { data, loading, error, lastUpdated, refetch } = useLiveData(
    `/api/sentiment-correlation?period=${period}&metric=${metric}&platform=${platform}`,
    { refreshInterval: 1800000 }, // 30 minutes
  )

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getCorrelationColor = (coefficient: number) => {
    const abs = Math.abs(coefficient)
    if (abs >= 0.7) return "text-green-600"
    if (abs >= 0.5) return "text-blue-600"
    if (abs >= 0.3) return "text-yellow-600"
    return "text-gray-600"
  }

  const getCorrelationBadge = (strength: string) => {
    switch (strength) {
      case "Very Strong":
        return "default"
      case "Strong":
        return "default"
      case "Moderate":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sentiment vs Market Performance</h2>
          <p className="text-muted-foreground">Analyze correlation between investor sentiment and market movements</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1M</SelectItem>
              <SelectItem value="3m">3M</SelectItem>
              <SelectItem value="6m">6M</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
              <SelectItem value="2y">2Y</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sp500">S&P 500</SelectItem>
              <SelectItem value="nasdaq">NASDAQ</SelectItem>
              <SelectItem value="vix">VIX</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combined</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
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
          <Info className="h-4 w-4" />
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
            Showing sample correlation data based on historical patterns. Live correlation analysis in development.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Correlation Coefficient</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className={`text-2xl font-bold ${getCorrelationColor(data.correlation.coefficient)}`}>
                  {data.correlation.coefficient}
                </div>
                <p className="text-xs text-muted-foreground">{data.correlation.direction} correlation</p>
                <Badge variant={getCorrelationBadge(data.correlation.strength)} className="mt-2">
                  {data.correlation.strength}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Statistical Significance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{data.correlation.significance}</div>
                <p className="text-xs text-muted-foreground">p-value &lt; 0.05</p>
                <Badge
                  variant={data.correlation.significance === "Significant" ? "default" : "outline"}
                  className="mt-2"
                >
                  {data.correlation.significance === "Significant" ? "Reliable" : "Weak"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{data.metadata.dataPoints}</div>
                <p className="text-xs text-muted-foreground">{period.toUpperCase()} period</p>
                <Badge variant="secondary" className="mt-2">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Predictive Power</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-2xl font-bold">{Math.round(Math.abs(data.correlation.coefficient) * 100)}%</div>
                <p className="text-xs text-muted-foreground">Explained variance</p>
                <Badge variant={Math.abs(data.correlation.coefficient) > 0.5 ? "default" : "outline"} className="mt-2">
                  {Math.abs(data.correlation.coefficient) > 0.5 ? "Useful" : "Limited"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scatter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scatter">Correlation Plot</TabsTrigger>
          <TabsTrigger value="timeline">Time Series</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="scatter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment vs Market Returns Correlation</CardTitle>
              <CardDescription>Each point represents a day's sentiment score vs market return</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] animate-pulse bg-gray-200 rounded"></div>
              ) : data?.data?.combined ? (
                <ChartContainer
                  config={{
                    sentiment: {
                      label: "Sentiment",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={data.data.combined}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="sentiment"
                        name="Sentiment Score"
                        domain={[0, 100]}
                        label={{ value: "Sentiment Score", position: "insideBottom", offset: -10 }}
                      />
                      <YAxis
                        dataKey="marketReturn"
                        name="Market Return %"
                        label={{ value: "Market Return %", angle: -90, position: "insideLeft" }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{new Date(data.date).toLocaleDateString()}</p>
                                <p className="text-sm">Sentiment: {data.sentiment}</p>
                                <p className="text-sm">Market Return: {data.marketReturn}%</p>
                                <p className="text-sm">Price: ${data.marketPrice?.toLocaleString()}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter dataKey="marketReturn" fill="var(--color-sentiment)" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No correlation data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment and Market Performance Over Time</CardTitle>
              <CardDescription>Compare sentiment trends with market movements</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] animate-pulse bg-gray-200 rounded"></div>
              ) : data?.data?.combined ? (
                <ChartContainer
                  config={{
                    sentiment: {
                      label: "Sentiment",
                      color: "hsl(var(--chart-1))",
                    },
                    marketPrice: {
                      label: "Market Price",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.data.combined}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis yAxisId="left" domain={[0, 100]} />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}:{" "}
                                    {entry.name === "sentiment"
                                      ? entry.value
                                      : entry.name === "marketPrice"
                                        ? `$${entry.value?.toLocaleString()}`
                                        : `${entry.value}%`}
                                  </p>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sentiment"
                        stroke="var(--color-sentiment)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="marketPrice"
                        stroke="var(--color-marketPrice)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No timeline data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {data?.insights ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Analysis of sentiment-market relationship</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Leading Indicator</p>
                      <p className="text-sm text-muted-foreground">{data.insights.leadingIndicator}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Platform Comparison</p>
                      <p className="text-sm text-muted-foreground">{data.insights.strongestCorrelation}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingDown className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Volatility Impact</p>
                      <p className="text-sm text-muted-foreground">{data.insights.volatilityImpact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Implications</CardTitle>
                  <CardDescription>How to use sentiment correlation for trading decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-green-600">Strong Positive Correlation</h4>
                    <p className="text-sm text-muted-foreground">
                      When correlation &gt; 0.5, sentiment can be used as a leading indicator for market direction
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-yellow-600">Moderate Correlation</h4>
                    <p className="text-sm text-muted-foreground">
                      Use sentiment as a supplementary signal alongside technical and fundamental analysis
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-red-600">Weak Correlation</h4>
                    <p className="text-sm text-muted-foreground">
                      Sentiment shows limited predictive power - rely on other indicators
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Current Recommendation</h4>
                    <p className="text-sm">{data.insights.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">No insights available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
