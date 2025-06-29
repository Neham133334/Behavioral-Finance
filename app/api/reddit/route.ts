import { type NextRequest, NextResponse } from "next/server"

// Reddit API integration with better error handling and fallback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subreddit = searchParams.get("subreddit") || "investing+stocks+SecurityAnalysis"
    const limit = Number.parseInt(searchParams.get("limit") || "25")
    const timeframe = searchParams.get("timeframe") || "day"

    // Try multiple Reddit endpoints for better reliability
    const endpoints = [
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}&t=${timeframe}`,
      `https://www.reddit.com/r/investing/hot.json?limit=${limit}`,
      `https://www.reddit.com/r/stocks/hot.json?limit=${limit}`,
    ]

    let data = null
    let lastError = null

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch from: ${endpoint}`)

        const response = await fetch(endpoint, {
          headers: {
            "User-Agent": "BehavioralFinanceDashboard/1.0.0 (by /u/behaviorfinance)",
            Accept: "application/json",
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (response.ok) {
          const jsonData = await response.json()
          if (jsonData && jsonData.data && jsonData.data.children) {
            data = jsonData
            break
          }
        } else {
          console.log(`Endpoint failed with status: ${response.status}`)
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log(`Endpoint failed:`, error)
        lastError = error
        continue
      }
    }

    // If all endpoints failed, return mock data with error indication
    if (!data) {
      console.log("All Reddit endpoints failed, returning mock data")
      return NextResponse.json({
        posts: generateMockRedditData(),
        metadata: {
          subreddit: "mock_data",
          count: 10,
          timestamp: new Date().toISOString(),
          error: "Live Reddit data unavailable - showing sample data",
          lastError: lastError?.message || "Unknown error",
        },
        metrics: {
          averageSentiment: 68,
          bullishPercentage: 65,
          bearishPercentage: 20,
          neutralPercentage: 15,
        },
      })
    }

    // Process Reddit posts
    const posts = data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext || "",
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      subreddit: child.data.subreddit,
      url: child.data.url,
      author: child.data.author,
    }))

    // Add sentiment analysis
    const postsWithSentiment = posts.map((post) => ({
      ...post,
      sentiment: analyzeSentiment(post.title + " " + post.selftext),
    }))

    // Calculate metrics
    const sentimentScores = postsWithSentiment.map((p) => p.sentiment)
    const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
    const bullishCount = sentimentScores.filter((s) => s > 60).length
    const bearishCount = sentimentScores.filter((s) => s < 40).length

    return NextResponse.json({
      posts: postsWithSentiment,
      metadata: {
        subreddit,
        count: posts.length,
        timestamp: new Date().toISOString(),
      },
      metrics: {
        averageSentiment: Math.round(avgSentiment),
        bullishPercentage: Math.round((bullishCount / posts.length) * 100),
        bearishPercentage: Math.round((bearishCount / posts.length) * 100),
        neutralPercentage: Math.round(((posts.length - bullishCount - bearishCount) / posts.length) * 100),
      },
    })
  } catch (error) {
    console.error("Reddit API error:", error)

    // Return mock data instead of error
    return NextResponse.json({
      posts: generateMockRedditData(),
      metadata: {
        subreddit: "mock_data",
        count: 10,
        timestamp: new Date().toISOString(),
        error: "Reddit API temporarily unavailable - showing sample data",
      },
      metrics: {
        averageSentiment: 68,
        bullishPercentage: 65,
        bearishPercentage: 20,
        neutralPercentage: 15,
      },
    })
  }
}

// Enhanced sentiment analysis function
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
    "excellent",
    "strong",
    "growth",
    "rally",
    "surge",
    "boom",
    "positive",
    "optimistic",
    "confident",
    "calls",
    "long",
    "breakout",
    "momentum",
    "uptrend",
    "support",
    "bounce",
    "recovery",
    "green",
    "winning",
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
    "terrible",
    "awful",
    "weak",
    "decline",
    "drop",
    "plunge",
    "correction",
    "negative",
    "pessimistic",
    "worried",
    "puts",
    "short",
    "breakdown",
    "resistance",
    "downtrend",
    "red",
    "losing",
    "panic",
    "fear",
    "bubble",
    "overvalued",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let score = 50 // neutral baseline
  let wordCount = 0

  words.forEach((word) => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, "")
    if (cleanWord.length > 2) {
      // Only count meaningful words
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

  // Normalize based on text length
  if (wordCount > 0) {
    const adjustment = Math.min(wordCount * 2, 20) // Cap the adjustment
    if (score > 50) score = Math.min(score + adjustment, 95)
    if (score < 50) score = Math.max(score - adjustment, 5)
  }

  return Math.max(5, Math.min(95, Math.round(score)))
}

// Generate realistic mock data for fallback
function generateMockRedditData() {
  const mockPosts = [
    {
      id: "mock1",
      title: "Market rally continues as tech stocks surge",
      selftext: "Seeing strong momentum in AAPL and MSFT. Bullish sentiment across the board.",
      score: 245,
      num_comments: 67,
      created_utc: Math.floor(Date.now() / 1000) - 3600,
      subreddit: "investing",
      sentiment: 78,
    },
    {
      id: "mock2",
      title: "Concerns about market valuation at current levels",
      selftext: "P/E ratios seem stretched. Might be time to take some profits.",
      score: 189,
      num_comments: 43,
      created_utc: Math.floor(Date.now() / 1000) - 7200,
      subreddit: "stocks",
      sentiment: 32,
    },
    {
      id: "mock3",
      title: "AI stocks showing incredible growth potential",
      selftext: "NVDA earnings beat expectations. This sector is on fire!",
      score: 312,
      num_comments: 89,
      created_utc: Math.floor(Date.now() / 1000) - 1800,
      subreddit: "investing",
      sentiment: 85,
    },
    {
      id: "mock4",
      title: "Fed policy impact on market sentiment",
      selftext: "Interest rate decisions creating uncertainty in the markets.",
      score: 156,
      num_comments: 34,
      created_utc: Math.floor(Date.now() / 1000) - 5400,
      subreddit: "SecurityAnalysis",
      sentiment: 45,
    },
    {
      id: "mock5",
      title: "Long-term investment strategy discussion",
      selftext: "Dollar cost averaging into index funds remains solid approach.",
      score: 203,
      num_comments: 56,
      created_utc: Math.floor(Date.now() / 1000) - 9000,
      subreddit: "investing",
      sentiment: 62,
    },
  ]

  return mockPosts
}
