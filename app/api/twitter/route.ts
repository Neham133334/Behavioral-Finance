import { type NextRequest, NextResponse } from "next/server"

// Twitter API v2 integration with improved error handling
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || '$SPY OR $QQQ OR "stock market" OR "investing"'
    const maxResults = Number.parseInt(searchParams.get("max_results") || "50")

    // Check if Twitter Bearer Token is available
    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    if (!bearerToken) {
      console.log("Twitter Bearer Token not available, returning mock data")
      return NextResponse.json({
        tweets: generateMockTwitterData(),
        metadata: {
          query: "mock_data",
          count: 10,
          timestamp: new Date().toISOString(),
          error: "Twitter API credentials not configured - showing sample data",
        },
        metrics: {
          totalTweets: 10,
          averageSentiment: 72,
          bullishPercentage: 70,
          bearishPercentage: 15,
        },
      })
    }

    // Twitter API v2 endpoint
    const twitterUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,public_metrics,context_annotations&expansions=author_id`

    console.log(`Fetching from Twitter API: ${query}`)

    const response = await fetch(twitterUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    if (!response.ok) {
      console.log(`Twitter API failed with status: ${response.status}`)

      // Return mock data for API failures
      return NextResponse.json({
        tweets: generateMockTwitterData(),
        metadata: {
          query: "mock_data",
          count: 10,
          timestamp: new Date().toISOString(),
          error: `Twitter API error: ${response.status} ${response.statusText}`,
        },
        metrics: {
          totalTweets: 10,
          averageSentiment: 72,
          bullishPercentage: 70,
          bearishPercentage: 15,
        },
      })
    }

    const data = await response.json()

    // Handle case where no tweets are returned
    if (!data.data || data.data.length === 0) {
      console.log("No tweets returned from Twitter API")
      return NextResponse.json({
        tweets: generateMockTwitterData(),
        metadata: {
          query,
          count: 0,
          timestamp: new Date().toISOString(),
          error: "No recent tweets found for query",
        },
        metrics: {
          totalTweets: 0,
          averageSentiment: 50,
          bullishPercentage: 0,
          bearishPercentage: 0,
        },
      })
    }

    // Process tweets and add sentiment analysis
    const tweets = data.data || []
    const tweetsWithSentiment = tweets.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics || { like_count: 0, retweet_count: 0, reply_count: 0 },
      sentiment: analyzeSentiment(tweet.text),
    }))

    // Calculate overall sentiment metrics
    const sentimentScores = tweetsWithSentiment.map((t) => t.sentiment)
    const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
    const bullishCount = sentimentScores.filter((s) => s > 60).length
    const bearishCount = sentimentScores.filter((s) => s < 40).length

    return NextResponse.json({
      tweets: tweetsWithSentiment,
      metadata: {
        query,
        count: tweets.length,
        timestamp: new Date().toISOString(),
      },
      metrics: {
        totalTweets: tweets.length,
        averageSentiment: Math.round(avgSentiment),
        bullishPercentage: Math.round((bullishCount / tweets.length) * 100),
        bearishPercentage: Math.round((bearishCount / tweets.length) * 100),
      },
    })
  } catch (error) {
    console.error("Twitter API error:", error)

    // Return mock data instead of error
    return NextResponse.json({
      tweets: generateMockTwitterData(),
      metadata: {
        query: "mock_data",
        count: 10,
        timestamp: new Date().toISOString(),
        error: "Twitter API temporarily unavailable - showing sample data",
      },
      metrics: {
        totalTweets: 10,
        averageSentiment: 72,
        bullishPercentage: 70,
        bearishPercentage: 15,
      },
    })
  }
}

// Enhanced sentiment analysis function (same as Reddit)
function analyzeSentiment(text: string): number {
  if (!text || text.trim().length === 0) return 50

  const positiveWords = [
    "bull",
    "bullish",
    "buy",
    "moon",
    "rocket",
    "gains",
    "profit",
    "up",
    "rise",
    "good",
    "great",
    "calls",
    "strong",
    "growth",
    "rally",
    "surge",
    "boom",
    "positive",
    "optimistic",
    "confident",
    "long",
    "breakout",
    "momentum",
    "uptrend",
    "support",
    "bounce",
    "recovery",
    "green",
    "winning",
    "pump",
  ]

  const negativeWords = [
    "bear",
    "bearish",
    "sell",
    "crash",
    "dump",
    "loss",
    "down",
    "fall",
    "bad",
    "puts",
    "short",
    "weak",
    "decline",
    "drop",
    "plunge",
    "correction",
    "negative",
    "pessimistic",
    "worried",
    "breakdown",
    "resistance",
    "downtrend",
    "red",
    "losing",
    "panic",
    "fear",
    "bubble",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let score = 50
  let wordCount = 0

  words.forEach((word) => {
    const cleanWord = word.replace(/[^\w]/g, "")
    if (cleanWord.length > 2) {
      if (positiveWords.includes(cleanWord)) {
        score += 8
        wordCount++
      }
      if (negativeWords.includes(cleanWord)) {
        score -= 8
        wordCount++
      }
    }
  })

  if (wordCount > 0) {
    const adjustment = Math.min(wordCount * 2, 20)
    if (score > 50) score = Math.min(score + adjustment, 95)
    if (score < 50) score = Math.max(score - adjustment, 5)
  }

  return Math.max(5, Math.min(95, Math.round(score)))
}

// Generate realistic mock Twitter data
function generateMockTwitterData() {
  const mockTweets = [
    {
      id: "mock_tweet_1",
      text: "$SPY breaking out to new highs! This bull market has legs 🚀📈 #stocks #investing",
      created_at: new Date(Date.now() - 1800000).toISOString(),
      public_metrics: { like_count: 45, retweet_count: 12, reply_count: 8 },
      sentiment: 82,
    },
    {
      id: "mock_tweet_2",
      text: "Market looking overextended here. Time to take some profits? $QQQ $SPY #trading",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      public_metrics: { like_count: 23, retweet_count: 6, reply_count: 15 },
      sentiment: 35,
    },
    {
      id: "mock_tweet_3",
      text: "AI revolution is just getting started. $NVDA $MSFT leading the charge! 💪",
      created_at: new Date(Date.now() - 900000).toISOString(),
      public_metrics: { like_count: 67, retweet_count: 28, reply_count: 12 },
      sentiment: 88,
    },
    {
      id: "mock_tweet_4",
      text: "Fed meeting next week could shake things up. Stay cautious #Fed #markets",
      created_at: new Date(Date.now() - 5400000).toISOString(),
      public_metrics: { like_count: 34, retweet_count: 9, reply_count: 21 },
      sentiment: 42,
    },
    {
      id: "mock_tweet_5",
      text: "Long term investing in index funds never goes out of style $VTI $VOO",
      created_at: new Date(Date.now() - 7200000).toISOString(),
      public_metrics: { like_count: 56, retweet_count: 18, reply_count: 7 },
      sentiment: 68,
    },
  ]

  return mockTweets
}
