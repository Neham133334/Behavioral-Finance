"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const sentimentData = [
  { date: "2024-01-01", reddit: 65, twitter: 58, google: 72, overall: 65 },
  { date: "2024-01-02", reddit: 68, twitter: 62, google: 75, overall: 68 },
  { date: "2024-01-03", reddit: 72, twitter: 65, google: 78, overall: 72 },
  { date: "2024-01-04", reddit: 70, twitter: 68, google: 76, overall: 71 },
  { date: "2024-01-05", reddit: 75, twitter: 72, google: 80, overall: 76 },
  { date: "2024-01-06", reddit: 78, twitter: 75, google: 82, overall: 78 },
  { date: "2024-01-07", reddit: 74, twitter: 70, google: 79, overall: 74 },
]

const topicData = [
  { topic: "AI/Tech", sentiment: 85, mentions: 1250 },
  { topic: "Crypto", sentiment: 72, mentions: 890 },
  { topic: "Energy", sentiment: 68, mentions: 650 },
  { topic: "Healthcare", sentiment: 75, mentions: 580 },
  { topic: "Finance", sentiment: 62, mentions: 720 },
]

export function SentimentTracker() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Investor Sentiment Tracker</h2>
        <p className="text-muted-foreground">Real-time sentiment analysis from Reddit, Twitter, and Google Trends</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reddit Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Positive sentiment</p>
            <Badge variant="secondary" className="mt-2">
              r/investing, r/stocks
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Twitter Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Bullish tweets</p>
            <Badge variant="secondary" className="mt-2">
              $SPY, $QQQ trending
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Google Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">Search interest</p>
            <Badge variant="secondary" className="mt-2">
              "Buy stocks" +15%
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Sentiment Timeline</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Over Time</CardTitle>
              <CardDescription>7-day sentiment trend across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  reddit: {
                    label: "Reddit",
                    color: "hsl(var(--chart-1))",
                  },
                  twitter: {
                    label: "Twitter",
                    color: "hsl(var(--chart-2))",
                  },
                  google: {
                    label: "Google",
                    color: "hsl(var(--chart-3))",
                  },
                  overall: {
                    label: "Overall",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="reddit" stroke="var(--color-reddit)" strokeWidth={2} />
                    <Line type="monotone" dataKey="twitter" stroke="var(--color-twitter)" strokeWidth={2} />
                    <Line type="monotone" dataKey="google" stroke="var(--color-google)" strokeWidth={2} />
                    <Line type="monotone" dataKey="overall" stroke="var(--color-overall)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Sentiment Analysis</CardTitle>
              <CardDescription>Sentiment by market sector and topic</CardDescription>
            </CardHeader>
            <CardContent>
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
                  <BarChart data={topicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sentiment" fill="var(--color-sentiment)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topicData.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{topic.topic}</p>
                      <p className="text-sm text-muted-foreground">{topic.mentions} mentions</p>
                    </div>
                    <Badge
                      variant={topic.sentiment > 75 ? "default" : topic.sentiment > 65 ? "secondary" : "destructive"}
                    >
                      {topic.sentiment}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">AI/Tech Optimism</p>
                    <p className="text-sm text-muted-foreground">
                      Strong positive sentiment around AI stocks and tech innovation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Crypto Recovery</p>
                    <p className="text-sm text-muted-foreground">Improving sentiment in cryptocurrency discussions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Financial Sector Caution</p>
                    <p className="text-sm text-muted-foreground">
                      Mixed sentiment around banking and financial services
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
