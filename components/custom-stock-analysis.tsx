"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, Plus, X, TrendingUp, TrendingDown, BarChart3, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"

const POPULAR_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "CRM",
  "SPY",
  "QQQ",
  "VTI",
  "IWM",
  "GLD",
  "TLT",
  "XLF",
  "XLK",
  "XLE",
  "XLV",
]

const MACRO_INDICATORS = [
  { symbol: "DXY", name: "US Dollar Index" },
  { symbol: "TNX", name: "10-Year Treasury" },
  { symbol: "VIX", name: "Volatility Index" },
  { symbol: "GLD", name: "Gold ETF" },
  { symbol: "OIL", name: "Oil Futures" },
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "EUR=X", name: "EUR/USD" },
]

export function CustomStockAnalysis() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["AAPL", "MSFT", "SPY"])
  const [stockInput, setStockInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMacroCorrelations, setShowMacroCorrelations] = useState(false)

  // Fetch live stock data
  const {
    data: stockData,
    loading: stockLoading,
    error: stockError,
    refetch: refetchStocks,
  } = useLiveData(
    `/api/stocks?symbols=${selectedStocks.join(",")}&technicals=true`,
    { refreshInterval: 30000 }, // 30 seconds
  )

  // Fetch macro correlations
  const {
    data: macroData,
    loading: macroLoading,
    refetch: refetchMacro,
  } = useLiveData(
    `/api/macro-correlations?symbols=${selectedStocks.join(",")}&period=1y`,
    { refreshInterval: 300000, enabled: showMacroCorrelations }, // 5 minutes
  )

  const addStock = () => {
    const symbol = stockInput.toUpperCase().trim()
    if (symbol && !selectedStocks.includes(symbol) && selectedStocks.length < 10) {
      setSelectedStocks([...selectedStocks, symbol])
      setStockInput("")
    }
  }

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol))
  }

  const addPopularStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol) && selectedStocks.length < 10) {
      setSelectedStocks([...selectedStocks, symbol])
    }
  }

  const filteredPopularStocks = POPULAR_STOCKS.filter(
    (stock) => stock.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedStocks.includes(stock),
  )

  const formatMarketCap = (marketCap: number | null) => {
    if (!marketCap) return "N/A"
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getTechnicalSignal = (rsi: number | null, macd: number | null) => {
    if (!rsi || !macd) return { signal: "Neutral", color: "secondary" }

    if (rsi > 70 && macd < 0) return { signal: "Overbought", color: "destructive" }
    if (rsi < 30 && macd > 0) return { signal: "Oversold", color: "default" }
    if (macd > 0) return { signal: "Bullish", color: "default" }
    if (macd < 0) return { signal: "Bearish", color: "destructive" }
    return { signal: "Neutral", color: "secondary" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Custom Stock Analysis</h2>
          <p className="text-muted-foreground">Analyze your portfolio with live data and macro correlations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetchStocks} disabled={stockLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${stockLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stock Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Selection</CardTitle>
          <CardDescription>Add up to 10 stocks for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addStock()}
              className="flex-1"
            />
            <Button onClick={addStock} disabled={selectedStocks.length >= 10}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Selected Stocks */}
          <div className="flex flex-wrap gap-2">
            {selectedStocks.map((symbol) => (
              <Badge key={symbol} variant="secondary" className="px-3 py-1">
                {symbol}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeStock(symbol)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {/* Popular Stocks */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium">Popular Stocks</h4>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredPopularStocks.slice(0, 15).map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => addPopularStock(symbol)}
                  className="h-8"
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {stockError && (
        <Alert>
          <AlertDescription>{stockError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="details">Stock Details</TabsTrigger>
          <TabsTrigger value="technicals">Technical Analysis</TabsTrigger>
          <TabsTrigger value="macro" onClick={() => setShowMacroCorrelations(true)}>
            Macro Correlations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Add data quality indicator */}
          {stockData?.metadata && (
            <Alert
              className={
                stockData.metadata.dataQuality === "live"
                  ? "border-green-200 bg-green-50"
                  : stockData.metadata.dataQuality === "mixed"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <div className="flex items-center gap-2">
                {stockData.metadata.dataQuality === "live" ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : stockData.metadata.dataQuality === "mixed" ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-blue-600" />
                )}
                <AlertDescription>
                  <strong>Data Status:</strong> {stockData.metadata.message || "Loading..."}
                  {stockData.metadata.error && (
                    <span className="block text-sm mt-1 text-muted-foreground">{stockData.metadata.error}</span>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {stockLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stockData?.stocks ? (
            <div className="grid gap-4 md:grid-cols-3">
              {stockData.stocks.map((stock: any) => (
                <Card
                  key={stock.symbol}
                  className={stock.dataQuality === "mock" ? "border-dashed border-blue-300" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{stock.symbol}</h3>
                          {stock.dataQuality === "mock" && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Demo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                        <div className={`flex items-center ${getChangeColor(stock.change)}`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Volume:</span>
                          <span className="ml-1 font-medium">{(stock.volume / 1000000).toFixed(1)}M</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">P/E:</span>
                          <span className="ml-1 font-medium">{stock.pe?.toFixed(1) || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Cap:</span>
                          <span className="ml-1 font-medium">{formatMarketCap(stock.marketCap)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Beta:</span>
                          <span className="ml-1 font-medium">{stock.beta?.toFixed(2) || "N/A"}</span>
                        </div>
                      </div>
                      {stock.error && <p className="text-xs text-muted-foreground mt-2 italic">Note: {stock.error}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No stock data available. Add some stocks to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {stockData?.stocks ? (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Stock Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Symbol</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Change</th>
                        <th className="text-right p-2">Volume</th>
                        <th className="text-right p-2">P/E</th>
                        <th className="text-right p-2">EPS</th>
                        <th className="text-right p-2">Div Yield</th>
                        <th className="text-right p-2">52W High</th>
                        <th className="text-right p-2">52W Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.stocks.map((stock: any) => (
                        <tr key={stock.symbol} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{stock.symbol}</td>
                          <td className="p-2">{stock.name}</td>
                          <td className="p-2 text-right font-medium">${stock.price.toFixed(2)}</td>
                          <td className={`p-2 text-right ${getChangeColor(stock.change)}`}>
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </td>
                          <td className="p-2 text-right">{(stock.volume / 1000000).toFixed(1)}M</td>
                          <td className="p-2 text-right">{stock.pe?.toFixed(1) || "N/A"}</td>
                          <td className="p-2 text-right">${stock.eps?.toFixed(2) || "N/A"}</td>
                          <td className="p-2 text-right">{stock.dividendYield?.toFixed(2) || "0.00"}%</td>
                          <td className="p-2 text-right">${stock.week52High?.toFixed(2) || "N/A"}</td>
                          <td className="p-2 text-right">${stock.week52Low?.toFixed(2) || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-muted-foreground py-8">No detailed data available</div>
          )}
        </TabsContent>

        <TabsContent value="technicals" className="space-y-4">
          {stockData?.stocks ? (
            <div className="grid gap-4 md:grid-cols-2">
              {stockData.stocks.map((stock: any) => {
                const signal = getTechnicalSignal(stock.technicals?.rsi, stock.technicals?.macd)
                return (
                  <Card key={stock.symbol}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {stock.symbol}
                        <Badge variant={signal.color}>{signal.signal}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">RSI (14)</h4>
                            <p className="text-2xl font-bold">{stock.technicals?.rsi?.toFixed(1) || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">
                              {stock.technicals?.rsi > 70
                                ? "Overbought"
                                : stock.technicals?.rsi < 30
                                  ? "Oversold"
                                  : "Neutral"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">MACD</h4>
                            <p className="text-2xl font-bold">{stock.technicals?.macd?.toFixed(3) || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">
                              Signal: {stock.technicals?.macdSignal?.toFixed(3) || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Price vs 52-Week Range</h4>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${((stock.price - stock.week52Low) / (stock.week52High - stock.week52Low)) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>${stock.week52Low?.toFixed(2)}</span>
                            <span>${stock.week52High?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No technical data available</div>
          )}
        </TabsContent>

        <TabsContent value="macro" className="space-y-4">
          {macroLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading macro correlations...</p>
            </div>
          ) : macroData?.correlations ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Macro Economic Correlations</CardTitle>
                  <CardDescription>How your stocks correlate with major economic indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Stock</th>
                          {MACRO_INDICATORS.map((indicator) => (
                            <th key={indicator.symbol} className="text-center p-2">
                              {indicator.symbol}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStocks.map((stock) => (
                          <tr key={stock} className="border-b">
                            <td className="p-2 font-medium">{stock}</td>
                            {MACRO_INDICATORS.map((indicator) => {
                              const correlation = macroData.correlations.find(
                                (c: any) => c.stock === stock && c.macro === indicator.symbol,
                              )
                              const value = correlation?.correlation || 0
                              const color =
                                value > 0.3 ? "text-green-600" : value < -0.3 ? "text-red-600" : "text-gray-600"
                              return (
                                <td key={indicator.symbol} className={`p-2 text-center ${color} font-medium`}>
                                  {value.toFixed(2)}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Correlation Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Strongest Positive</p>
                        <p className="text-sm text-muted-foreground">{macroData.insights?.strongestPositive}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Strongest Negative</p>
                        <p className="text-sm text-muted-foreground">{macroData.insights?.strongestNegative}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Volatility Driver</p>
                        <p className="text-sm text-muted-foreground">{macroData.insights?.volatilityDriver}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Macro Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MACRO_INDICATORS.map((indicator) => (
                        <div key={indicator.symbol} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{indicator.symbol}</p>
                            <p className="text-sm text-muted-foreground">{indicator.name}</p>
                          </div>
                          <Badge variant="outline">
                            {Math.abs(
                              macroData.correlations.find((c: any) => c.macro === indicator.symbol)?.correlation || 0,
                            ) > 0.3
                              ? "High Impact"
                              : "Low Impact"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click "Refresh" to load macro correlation data</p>
              <Button variant="outline" className="mt-4" onClick={refetchMacro}>
                Load Correlations
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
