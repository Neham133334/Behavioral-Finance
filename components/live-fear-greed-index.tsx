"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useFearGreedData } from "@/hooks/use-live-data"
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LiveFearGreedIndex() {
  const { data, loading, error, lastUpdated, refetch } = useFearGreedData()

  const getIndexColor = (value: number) => {
    if (value <= 25) return "text-red-600"
    if (value <= 45) return "text-orange-500"
    if (value <= 55) return "text-yellow-500"
    if (value <= 75) return "text-green-500"
    return "text-red-600"
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Less than 1h ago"
    return `${hours}h ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Fear & Greed Index</h2>
          <p className="text-muted-foreground">Real-time market sentiment based on multiple behavioral indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Updated: {formatLastUpdated(lastUpdated)}</div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={refetch}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Fear & Greed Index</CardTitle>
            <CardDescription>Live market sentiment measurement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ) : data ? (
              <>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getIndexColor(data.index)}`}>{data.index}</div>
                  <div className="text-xl font-semibold mt-2">{data.label}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Extreme Fear</span>
                    <span>Extreme Greed</span>
                  </div>
                  <Progress value={data.index} className="h-3" />
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
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <div className="flex items-center justify-center gap-1">
                      {data.index > 50 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-lg font-semibold">{data.index > 50 ? "Greed" : "Fear"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <Badge variant={data.index > 75 || data.index < 25 ? "destructive" : "secondary"} className="mt-1">
                      {data.index > 75 || data.index < 25 ? "High" : "Moderate"}
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Index Components</CardTitle>
            <CardDescription>Real-time indicators contributing to the index</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : data?.components ? (
              <div className="space-y-4">
                {data.components.map((component: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{component.name}</span>
                      <span>{component.value}</span>
                    </div>
                    <Progress value={component.value} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Weight: {component.weight}%</span>
                      <Badge variant="outline" className="text-xs">
                        {component.value > 75
                          ? "Extreme Greed"
                          : component.value > 55
                            ? "Greed"
                            : component.value > 45
                              ? "Neutral"
                              : component.value > 25
                                ? "Fear"
                                : "Extreme Fear"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">No component data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
