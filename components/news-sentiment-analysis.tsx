"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useLiveData } from "@/hooks/use-live-data"
import { RefreshCw, AlertCircle, Newspaper, Clock, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NewsSentimentAnalysis() {
  const [timeframe, setTimeframe] = useState("24")
  const [query, setQuery] = useState("stock market OR finance OR investing OR economy")

  const { data, loading, error, lastUpdated, refetch } = useLiveData(
    `/api/news?hours=${timeframe}&query=${encodeURIComponent(query)}`,
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
    if (sentiment > 65) return { variant: "default", label: "Bullish" }
    if (sentiment < 35) return { variant: "destructive", label: "Bearish" }
    return { variant: "secondary", label: "Neutral" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">News Sentiment Analysis</h2>
          <p className="text-muted-foreground">Real-time financial news with sentiment analysis</p>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">News Sentiment</CardTitle>
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
                <p className="text-xs text-muted-foreground">{data.articles?.length || 0} articles analyzed</p>
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
                    ? "Bullish"
                    : data.metrics.averageSentiment < 40
                      ? "Bearish"
                      : "Neutral"}
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
                <p className="text-xs text-muted-foreground mt-4">Based on last {timeframe} hours</p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : data?.topics?.length ? (
              <div className="space-y-2">
                {data.topics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{topic.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{topic.count} articles</span>
                      <Badge
                        variant={
                          topic.averageSentiment > 60
                            ? "default"
                            : topic.averageSentiment < 40
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {topic.averageSentiment}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No topics available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Recent Articles</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latest Financial News</CardTitle>
              <CardDescription>Recent articles with sentiment analysis</CardDescription>
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
                          <h4 className="font-medium text-sm">{article.title}</h4>
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
                <div className="text-center text-muted-foreground py-8">No articles available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Sentiment Analysis</CardTitle>
              <CardDescription>Sentiment breakdown by financial topics</CardDescription>
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
                      <XAxis dataKey="topic" />
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
                  No topic data available
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Topic Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.topics?.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{topic.topic}</h4>
                      <p className="text-sm text-muted-foreground">{topic.count} articles</p>
                    </div>
                    <Badge
                      variant={
                        topic.averageSentiment > 60
                          ? "default"
                          : topic.averageSentiment < 40
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {topic.averageSentiment > 60 ? "Bullish" : topic.averageSentiment < 40 ? "Bearish" : "Neutral"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>News Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Sentiment Trend</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.metrics?.averageSentiment > 60
                        ? "Predominantly positive news coverage suggests bullish market sentiment"
                        : data?.metrics?.averageSentiment < 40
                          ? "Negative news coverage indicates cautious or bearish market sentiment"
                          : "Mixed news coverage reflects balanced market sentiment"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Topic Focus</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.topics?.[0]
                        ? `Current news cycle dominated by ${data.topics[0].topic} with ${
                            data.topics[0].averageSentiment > 60
                              ? "positive"
                              : data.topics[0].averageSentiment < 40
                                ? "negative"
                                : "neutral"
                          } sentiment`
                        : "No dominant topics identified in recent news"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Market Implications</p>
                    <p className="text-sm text-muted-foreground">
                      News sentiment often precedes market movements by 1-2 days, suggesting
                      {data?.metrics?.averageSentiment > 60
                        ? " potential positive momentum"
                        : data?.metrics?.averageSentiment < 40
                          ? " possible market weakness"
                          : " continued market stability"}
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
