"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRedditData, useTwitterData } from "@/hooks/use-live-data"
import { RefreshCw, AlertCircle, Wifi, WifiOff, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LiveSentimentTracker() {
  const {
    data: redditData,
    loading: redditLoading,
    error: redditError,
    lastUpdated: redditLastUpdated,
    refetch: refetchReddit,
  } = useRedditData("investing,stocks,SecurityAnalysis")

  const {
    data: twitterData,
    loading: twitterLoading,
    error: twitterError,
    lastUpdated: twitterLastUpdated,
    refetch: refetchTwitter,
  } = useTwitterData('$SPY OR $QQQ OR "stock market"')

  const isLoading = redditLoading || twitterLoading
  const hasError = redditError || twitterError

  // Check if we're showing mock data
  const isRedditMock = redditData?.metadata?.error?.includes("mock") || redditData?.metadata?.error?.includes("sample")
  const isTwitterMock =
    twitterData?.metadata?.error?.includes("mock") || twitterData?.metadata?.error?.includes("sample")

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

  const handleRefreshAll = () => {
    refetchReddit()
    refetchTwitter()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Sentiment Tracker</h2>
          <p className="text-muted-foreground">Real-time sentiment analysis from Reddit and Twitter</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {isLoading ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4 text-green-500" />}
            Last updated: {formatLastUpdated(redditLastUpdated || twitterLastUpdated)}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshAll} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Show info about mock data */}
      {(isRedditMock || isTwitterMock) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {isRedditMock && isTwitterMock
              ? "Showing sample data for both Reddit and Twitter due to API limitations."
              : isRedditMock
                ? "Showing sample Reddit data due to API limitations. Twitter data is live."
                : "Showing sample Twitter data due to API limitations. Reddit data is live."}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={handleRefreshAll}>
              Try to reconnect
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Show errors only if not using mock data */}
      {hasError && !isRedditMock && !isTwitterMock && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {redditError || twitterError}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={handleRefreshAll}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Reddit Sentiment
              {isRedditMock && (
                <Badge variant="outline" className="text-xs">
                  Sample
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {redditLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : redditData ? (
              <>
                <div className="text-2xl font-bold">{redditData.metrics?.averageSentiment || "N/A"}%</div>
                <p className="text-xs text-muted-foreground">{redditData.posts?.length || 0} posts analyzed</p>
                <Badge variant="secondary" className="mt-2">
                  r/investing, r/stocks
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Twitter Sentiment
              {isTwitterMock && (
                <Badge variant="outline" className="text-xs">
                  Sample
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {twitterLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : twitterData ? (
              <>
                <div className="text-2xl font-bold">{twitterData.metrics?.averageSentiment || "N/A"}%</div>
                <p className="text-xs text-muted-foreground">{twitterData.tweets?.length || 0} tweets analyzed</p>
                <Badge variant="secondary" className="mt-2">
                  $SPY, $QQQ trending
                </Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {redditData && twitterData
                    ? Math.round(
                        ((redditData.metrics?.averageSentiment || 50) + (twitterData.metrics?.averageSentiment || 50)) /
                          2,
                      )
                    : "N/A"}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Combined platforms</p>
                <Badge
                  variant={
                    redditData && twitterData
                      ? Math.round(
                          ((redditData.metrics?.averageSentiment || 50) +
                            (twitterData.metrics?.averageSentiment || 50)) /
                            2,
                        ) > 60
                        ? "default"
                        : "secondary"
                      : "outline"
                  }
                  className="mt-2"
                >
                  {redditData && twitterData
                    ? Math.round(
                        ((redditData.metrics?.averageSentiment || 50) + (twitterData.metrics?.averageSentiment || 50)) /
                          2,
                      ) > 60
                      ? "Bullish"
                      : "Neutral"
                    : "Unknown"}
                </Badge>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reddit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reddit">Reddit Analysis</TabsTrigger>
          <TabsTrigger value="twitter">Twitter Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="reddit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Reddit Posts Analysis
                {isRedditMock && (
                  <Badge variant="outline" className="text-xs">
                    Sample Data
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Latest posts from investing subreddits with sentiment scores</CardDescription>
            </CardHeader>
            <CardContent>
              {redditLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : redditData?.posts ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {redditData.posts.slice(0, 10).map((post: any) => (
                    <div key={post.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          r/{post.subreddit} • {post.score} upvotes • {post.num_comments} comments
                        </p>
                      </div>
                      <Badge
                        variant={post.sentiment > 60 ? "default" : post.sentiment < 40 ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        {post.sentiment}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No Reddit data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Twitter Analysis
                {isTwitterMock && (
                  <Badge variant="outline" className="text-xs">
                    Sample Data
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Recent tweets about stocks and market sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              {twitterLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : twitterData?.tweets ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {twitterData.tweets.slice(0, 10).map((tweet: any) => (
                    <div key={tweet.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm line-clamp-3">{tweet.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tweet.public_metrics?.like_count || 0} likes • {tweet.public_metrics?.retweet_count || 0}{" "}
                          retweets
                        </p>
                      </div>
                      <Badge
                        variant={tweet.sentiment > 60 ? "default" : tweet.sentiment < 40 ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        {tweet.sentiment}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No Twitter data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
