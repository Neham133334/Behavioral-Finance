"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, AlertCircle, Newspaper, Clock, ExternalLink, Globe, TrendingUp, TrendingDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const EUROPEAN_COUNTRIES = [
  { code: "all", name: "All Europe", flag: "🇪🇺" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "it", name: "Italy", flag: "🇮🇹" },
  { code: "es", name: "Spain", flag: "🇪🇸" },
  { code: "nl", name: "Netherlands", flag: "🇳🇱" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
]

export function EuropeanSentimentAnalysis() {
  const [timeframe, setTimeframe] = useState("24")
  const [country, setCountry] = useState("all")
  const [query, setQuery] = useState("european stocks finance investing economy ECB")

  const { data, loading, error, lastUpdated, refetch } = useLiveData(
    `/api/eu-news?hours=${timeframe}&country=${country}&query=${encodeURIComponent(query)}`,
    { refreshInterval: 900000 }, // 15 minutes
  )

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

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 65) return { variant: "default", label: "Bullish", color: "text-green-600" }
    if (sentiment < 35) return { variant: "destructive", label: "Bearish", color: "text-red-600" }
    return { variant: "secondary", label: "Neutral", color: "text-gray-600" }
  }

  const getCountryFlag = (countryName: string) => {
    const countryFlags: Record<string, string> = {
      Germany: "🇩🇪",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Netherlands: "🇳🇱",
      UK: "🇬🇧",
      Europe: "🇪🇺",
    }
    return countryFlags[countryName] || "🇪🇺"
  }

  // Mock EU policy impact data for demonstration
  const euPolicyImpactData = [
    { year: "2010", policy: "Greek Bailout", impact: -15, description: "Sovereign debt crisis impact" },
    { year: "2012", policy: "OMT Program", impact: 12, description: "Draghi's 'Whatever it takes'" },
    { year: "2015", policy: "QE Launch", impact: 18, description: "Asset purchase program begins" },
    { year: "2016", policy: "Brexit Vote", impact: -22, description: "UK referendum uncertainty" },
    { year: "2018", policy: "GDPR Implementation", impact: -8, description: "Data protection regulation" },
    { year: "2020", policy: "PEPP Launch", impact: 25, description: "Pandemic emergency purchases" },
    { year: "2021", policy: "Recovery Fund", impact: 15, description: "NextGenerationEU program" },
    { year: "2022", policy: "Energy Crisis Response", impact: -12, description: "Ukraine war energy impact" },
    { year: "2023", policy: "Green Deal Acceleration", impact: 8, description: "Climate transition funding" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">🇪🇺 European Market Sentiment</h2>
          <p className="text-muted-foreground">Live European financial news sentiment and policy impact analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EUROPEAN_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6h</SelectItem>
              <SelectItem value="12">12h</SelectItem>
              <SelectItem value="24">24h</SelectItem>
              <SelectItem value="48">48h</SelectItem>
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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={refetch}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">European Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data?.metrics ? (
              <>
                <div className="text-2xl font-bold">{data.metrics.averageSentiment}%</div>
                <p className="text-xs text-muted-foreground">{data.articles?.length || 0} EU articles analyzed</p>
                <Badge
                  variant={
                    data.metrics.averageSentiment > 60
                      ? "default"
                      : data.metrics.averageSentiment < 40
                        ? "destructive"
                        : "secondary"
                  }
                  className="mt-2"
                >
                  {data.metrics.averageSentiment > 60
                    ? "🐂 Bullish"
                    : data.metrics.averageSentiment < 40
                      ? "🐻 Bearish"
                      : "😐 Neutral"}
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : data?.metrics ? (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex flex-col items-center">
                    <span className="text-green-600 font-bold">{data.metrics.bullishPercentage}%</span>
                    <span className="text-xs text-muted-foreground">Bullish</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-500 font-bold">{data.metrics.neutralPercentage}%</span>
                    <span className="text-xs text-muted-foreground">Neutral</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-red-600 font-bold">{data.metrics.bearishPercentage}%</span>
                    <span className="text-xs text-muted-foreground">Bearish</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="flex h-2.5 rounded-full">
                    <div
                      className="bg-green-600 h-2.5 rounded-l-full"
                      style={{ width: `${data.metrics.bullishPercentage}%` }}
                    ></div>
                    <div className="bg-gray-500 h-2.5" style={{ width: `${data.metrics.neutralPercentage}%` }}></div>
                    <div
                      className="bg-red-600 h-2.5 rounded-r-full"
                      style={{ width: `${data.metrics.bearishPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top EU Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : data?.topics?.length ? (
              <div className="space-y-2">
                {data.topics.slice(0, 4).map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm truncate">{topic.topic}</span>
                    <Badge
                      variant={
                        topic.averageSentiment > 60
                          ? "default"
                          : topic.averageSentiment < 40
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs ml-2"
                    >
                      {topic.averageSentiment}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No topics available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Regional Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">🇩🇪 Germany</span>
                <span className="text-xs text-muted-foreground">Manufacturing</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🇫🇷 France</span>
                <span className="text-xs text-muted-foreground">Energy Policy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🇮🇹 Italy</span>
                <span className="text-xs text-muted-foreground">Banking</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🇪🇸 Spain</span>
                <span className="text-xs text-muted-foreground">Renewables</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">European News</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          <TabsTrigger value="policy">Policy Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest European Financial News</CardTitle>
              <CardDescription>Recent articles with sentiment analysis from European markets</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : data?.articles?.length ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {data.articles.map((article, index) => {
                    const sentimentBadge = getSentimentBadge(article.sentiment)
                    return (
                      <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getCountryFlag(article.country)}</span>
                            <h4 className="font-medium text-sm">{article.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Newspaper className="h-3 w-3 mr-1" />
                              {article.source}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatPublishedDate(article.publishedAt)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Globe className="h-3 w-3 mr-1" />
                              {article.country}
                            </div>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Read more
                            </a>
                          </div>
                        </div>
                        <Badge variant={sentimentBadge.variant}>
                          {article.sentiment} | {sentimentBadge.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No European articles available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>European Topic Sentiment Analysis</CardTitle>
              <CardDescription>Sentiment breakdown by European financial topics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] animate-pulse bg-gray-200 rounded"></div>
              ) : data?.topics?.length ? (
                <ChartContainer
                  config={{
                    sentiment: {
                      label: "Sentiment Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{label}</p>
                                <p className="text-sm">Sentiment: {data.averageSentiment}</p>
                                <p className="text-sm">Articles: {data.count}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="averageSentiment" fill="var(--color-sentiment)" name="Sentiment Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No European topic data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EU Policy Impact on Markets</CardTitle>
              <CardDescription>Historical analysis of European policy decisions and market reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  impact: {
                    label: "Market Impact (%)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={euPolicyImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                              <p className="font-semibold">
                                {data.policy} ({label})
                              </p>
                              <p className="text-sm">
                                Impact: {data.impact > 0 ? "+" : ""}
                                {data.impact}%
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="impact"
                      stroke="var(--color-impact)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-impact)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Major Policy Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {euPolicyImpactData
                  .filter((item) => Math.abs(item.impact) > 15)
                  .map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${item.impact > 0 ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <div>
                        <p className="font-medium">
                          {item.policy} ({item.year})
                        </p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center mt-1">
                          {item.impact > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span
                            className={`text-sm font-medium ${item.impact > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.impact > 0 ? "+" : ""}
                            {item.impact}% market impact
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Monetary Policy Dominance</p>
                    <p className="text-sm text-muted-foreground">
                      ECB policy decisions have the strongest impact on European markets, with QE programs showing
                      consistently positive effects.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Regulatory Uncertainty</p>
                    <p className="text-sm text-muted-foreground">
                      New regulations like GDPR initially create market uncertainty, but long-term effects are often
                      neutral as markets adapt.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Crisis Response Effectiveness</p>
                    <p className="text-sm text-muted-foreground">
                      EU's crisis response mechanisms (bailouts, recovery funds) have become more effective over time,
                      reducing market volatility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
