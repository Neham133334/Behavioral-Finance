"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, AlertCircle, Plus, X, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const POPULAR_EU_STOCKS = [
  { symbol: "ASML.AS", name: "ASML Holding", country: "🇳🇱", sector: "Technology" },
  { symbol: "SAP.DE", name: "SAP SE", country: "🇩🇪", sector: "Technology" },
  { symbol: "LVMH.PA", name: "LVMH", country: "🇫🇷", sector: "Consumer Goods" },
  { symbol: "NESN.SW", name: "Nestlé", country: "🇨🇭", sector: "Consumer Goods" },
  { symbol: "NOVO-B.CO", name: "Novo Nordisk", country: "🇩🇰", sector: "Healthcare" },
  { symbol: "TTE.PA", name: "TotalEnergies", country: "🇫🇷", sector: "Energy" },
  { symbol: "UNA.AS", name: "Unilever", country: "🇳🇱", sector: "Consumer Goods" },
  { symbol: "SIE.DE", name: "Siemens", country: "🇩🇪", sector: "Industrials" },
  { symbol: "AZN.L", name: "AstraZeneca", country: "🇬🇧", sector: "Healthcare" },
  { symbol: "SHEL.L", name: "Shell", country: "🇬🇧", sector: "Energy" },
]

export function EuropeanStockTracker() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([
    "ASML.AS",
    "SAP.DE",
    "LVMH.PA",
    "NESN.SW",
    "NOVO-B.CO",
  ])
  const [newStock, setNewStock] = useState("")
  const [showTechnicals, setShowTechnicals] = useState(true)

  const { data, loading, error, lastUpdated, refetch } = useLiveData(
    `/api/eu-stocks?symbols=${selectedStocks.join(",")}&technicals=${showTechnicals}`,
    { refreshInterval: 30000 }, // 30 seconds
  )

  const addStock = () => {
    if (newStock && !selectedStocks.includes(newStock.toUpperCase()) && selectedStocks.length < 10) {
      setSelectedStocks([...selectedStocks, newStock.toUpperCase()])
      setNewStock("")
    }
  }

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol))
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const formatCurrency = (value: number, currency = "EUR") => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `€${(value / 1e12).toFixed(1)}T`
    if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`
    return `€${value.toFixed(0)}`
  }

  const getTechnicalSignal = (technicals: any) => {
    if (!technicals) return { signal: "Unknown", color: "text-gray-500" }

    const { rsi, macd, macdSignal } = technicals
    let bullishSignals = 0
    let bearishSignals = 0

    if (rsi) {
      if (rsi < 30) bullishSignals++ // Oversold
      if (rsi > 70) bearishSignals++ // Overbought
    }

    if (macd && macdSignal) {
      if (macd > macdSignal) bullishSignals++
      if (macd < macdSignal) bearishSignals++
    }

    if (bullishSignals > bearishSignals) return { signal: "Bullish", color: "text-green-600" }
    if (bearishSignals > bullishSignals) return { signal: "Bearish", color: "text-red-600" }
    return { signal: "Neutral", color: "text-gray-600" }
  }

  const getDataQualityBadge = (dataQuality: string) => {
    switch (dataQuality) {
      case "live":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Live
          </Badge>
        )
      case "mixed":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Mixed
          </Badge>
        )
      case "mock":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Demo
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">🇪🇺 European Stock Tracker</h2>
          <p className="text-muted-foreground">Live European stock data with technical analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Updated: {formatLastUpdated(lastUpdated)}</div>
          {data?.metadata && getDataQualityBadge(data.metadata.dataQuality)}
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

      {data?.metadata?.message && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{data.metadata.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stock Selection</CardTitle>
          <CardDescription>Add or remove European stocks to track (max 10)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter stock symbol (e.g., ASML.AS)"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addStock()}
              className="flex-1"
            />
            <Button onClick={addStock} disabled={selectedStocks.length >= 10 || !newStock}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {POPULAR_EU_STOCKS.map((stock) => (
              <Button
                key={stock.symbol}
                variant={selectedStocks.includes(stock.symbol) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedStocks.includes(stock.symbol)) {
                    removeStock(stock.symbol)
                  } else if (selectedStocks.length < 10) {
                    setSelectedStocks([...selectedStocks, stock.symbol])
                  }
                }}
                className="justify-start"
              >
                <span className="mr-2">{stock.country}</span>
                {stock.symbol}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedStocks.map((symbol) => (
              <Badge key={symbol} variant="secondary" className="flex items-center gap-1">
                {symbol}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeStock(symbol)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="technicals">Technical Indicators</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.stocks?.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.stocks.map((stock, index) => (
                <Card key={index} className={`${stock.dataQuality === "mock" ? "border-dashed border-blue-300" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {stock.country === "Germany"
                            ? "🇩🇪"
                            : stock.country === "France"
                              ? "🇫🇷"
                              : stock.country === "Netherlands"
                                ? "🇳🇱"
                                : stock.country === "Switzerland"
                                  ? "🇨🇭"
                                  : stock.country === "Denmark"
                                    ? "🇩🇰"
                                    : stock.country === "UK"
                                      ? "🇬🇧"
                                      : "🇪🇺"}
                        </span>
                        <h3 className="font-semibold text-sm">{stock.symbol}</h3>
                      </div>
                      {stock.dataQuality === "mock" && (
                        <Badge variant="outline" className="text-xs">
                          Demo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{stock.name}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{formatCurrency(stock.price, stock.currency)}</span>
                        <div className="flex items-center">
                          {stock.changePercent > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              stock.changePercent > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {stock.changePercent > 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Volume:</span>
                          <div className="font-medium">{stock.volume.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Cap:</span>
                          <div className="font-medium">
                            {stock.marketCap ? formatLargeNumber(stock.marketCap) : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P/E:</span>
                          <div className="font-medium">{stock.pe ? stock.pe.toFixed(1) : "N/A"}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Beta:</span>
                          <div className="font-medium">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</div>
                        </div>
                      </div>

                      {stock.week52High && stock.week52Low && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>52W Range</span>
                            <span>
                              {formatCurrency(stock.week52Low, stock.currency)} -{" "}
                              {formatCurrency(stock.week52High, stock.currency)}
                            </span>
                          </div>
                          <Progress
                            value={((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{stock.exchange}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No European stock data available</div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Stock Information</CardTitle>
              <CardDescription>Comprehensive data for selected European stocks</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : data?.stocks?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Stock</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Change</th>
                        <th className="text-right p-2">Volume</th>
                        <th className="text-right p-2">Market Cap</th>
                        <th className="text-right p-2">P/E</th>
                        <th className="text-right p-2">Beta</th>
                        <th className="text-center p-2">Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.stocks.map((stock, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-32">{stock.name}</div>
                            </div>
                          </td>
                          <td className="text-right p-2 font-medium">{formatCurrency(stock.price, stock.currency)}</td>
                          <td className="text-right p-2">
                            <span className={`${stock.changePercent > 0 ? "text-green-600" : "text-red-600"}`}>
                              {stock.changePercent > 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="text-right p-2">{stock.volume.toLocaleString()}</td>
                          <td className="text-right p-2">
                            {stock.marketCap ? formatLargeNumber(stock.marketCap) : "N/A"}
                          </td>
                          <td className="text-right p-2">{stock.pe ? stock.pe.toFixed(1) : "N/A"}</td>
                          <td className="text-right p-2">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</td>
                          <td className="text-center p-2">
                            <div className="flex items-center justify-center">
                              <span className="mr-1">
                                {stock.country === "Germany"
                                  ? "🇩🇪"
                                  : stock.country === "France"
                                    ? "🇫🇷"
                                    : stock.country === "Netherlands"
                                      ? "🇳🇱"
                                      : stock.country === "Switzerland"
                                        ? "🇨🇭"
                                        : stock.country === "Denmark"
                                          ? "🇩🇰"
                                          : stock.country === "UK"
                                            ? "🇬🇧"
                                            : "🇪🇺"}
                              </span>
                              <span className="text-xs">{stock.country}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No detailed data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : data?.stocks?.length ? (
              data.stocks.map((stock, index) => {
                const technicalSignal = getTechnicalSignal(stock.technicals)
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span>
                            {stock.country === "Germany"
                              ? "🇩🇪"
                              : stock.country === "France"
                                ? "🇫🇷"
                                : stock.country === "Netherlands"
                                  ? "🇳🇱"
                                  : stock.country === "Switzerland"
                                    ? "🇨🇭"
                                    : stock.country === "Denmark"
                                      ? "🇩🇰"
                                      : stock.country === "UK"
                                        ? "🇬🇧"
                                        : "🇪🇺"}
                          </span>
                          {stock.symbol}
                        </span>
                        <Badge
                          variant={
                            technicalSignal.signal === "Bullish"
                              ? "default"
                              : technicalSignal.signal === "Bearish"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {technicalSignal.signal}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stock.technicals ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">RSI (14)</span>
                              <span className="text-sm">{stock.technicals.rsi?.toFixed(1) || "N/A"}</span>
                            </div>
                            {stock.technicals.rsi && (
                              <div className="space-y-1">
                                <Progress value={stock.technicals.rsi} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Oversold (30)</span>
                                  <span>Overbought (70)</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">MACD:</span>
                              <div className="font-medium">{stock.technicals.macd?.toFixed(3) || "N/A"}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Signal:</span>
                              <div className="font-medium">{stock.technicals.macdSignal?.toFixed(3) || "N/A"}</div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Technical analysis based on 14-day RSI and MACD indicators
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Technical indicators not available</div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-2 text-center text-muted-foreground py-8">
                No technical analysis data available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
