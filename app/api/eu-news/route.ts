import { type NextRequest, NextResponse } from "next/server"

// European News API integration with sentiment analysis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "european stocks finance investing economy ECB"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const hours = Number.parseInt(searchParams.get("hours") || "24")
    const country = searchParams.get("country") || "all" // all, de, fr, it, es, nl

    console.log(`Fetching EU news for query: ${query}, limit: ${limit}, hours: ${hours}, country: ${country}`)

    // Calculate the timestamp for filtering by recency
    const sinceTimestamp = new Date()
    sinceTimestamp.setHours(sinceTimestamp.getHours() - hours)

    // Fetch European news data
    const newsData = await fetchEuropeanNewsData(query, limit, sinceTimestamp, country)

    // Add sentiment analysis to each news article
    const newsWithSentiment = newsData.map((article) => ({
      ...article,
      sentiment: analyzeEuropeanSentiment(article.title + " " + (article.description || "")),
    }))

    // Calculate aggregate sentiment metrics
    const sentimentScores = newsWithSentiment.map((article) => article.sentiment)
    const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
    const bullishCount = sentimentScores.filter((s) => s > 60).length
    const bearishCount = sentimentScores.filter((s) => s < 40).length

    // Extract European-specific topics
    const topics = extractEuropeanTopics(newsWithSentiment)

    return NextResponse.json({
      articles: newsWithSentiment,
      metrics: {
        averageSentiment: Math.round(avgSentiment),
        bullishPercentage: Math.round((bullishCount / newsWithSentiment.length) * 100),
        bearishPercentage: Math.round((bearishCount / newsWithSentiment.length) * 100),
        neutralPercentage: Math.round(
          ((newsWithSentiment.length - bullishCount - bearishCount) / newsWithSentiment.length) * 100,
        ),
      },
      topics,
      metadata: {
        query,
        country,
        count: newsWithSentiment.length,
        timestamp: new Date().toISOString(),
        hours,
        dataQuality: "live",
      },
    })
  } catch (error) {
    console.error("EU News API error:", error)

    return NextResponse.json({
      articles: generateMockEuropeanNewsData(),
      metrics: {
        averageSentiment: 52,
        bullishPercentage: 38,
        bearishPercentage: 35,
        neutralPercentage: 27,
      },
      topics: [
        { topic: "ECB Policy", count: 12, averageSentiment: 45 },
        { topic: "EU Regulations", count: 8, averageSentiment: 38 },
        { topic: "German Economy", count: 7, averageSentiment: 55 },
        { topic: "Energy Crisis", count: 6, averageSentiment: 32 },
        { topic: "Banking Sector", count: 5, averageSentiment: 48 },
      ],
      metadata: {
        query: "european stocks finance investing economy ECB",
        country: "all",
        count: 15,
        timestamp: new Date().toISOString(),
        hours: 24,
        error: `EU News API error: ${error instanceof Error ? error.message : "Unknown error"}`,
        dataQuality: "mock",
      },
    })
  }
}

async function fetchEuropeanNewsData(query: string, limit: number, sinceTimestamp: Date, country: string) {
  const newsApiKey = process.env.NEWS_API_KEY
  const gnewsApiKey = process.env.GNEWS_API_KEY

  if (!newsApiKey && !gnewsApiKey) {
    console.log("No news API keys available, using mock data")
    return generateMockEuropeanNewsData()
  }

  let articles: any[] = []

  // European country codes for news APIs
  const countryMap: Record<string, string> = {
    all: "de,fr,it,es,nl,gb",
    de: "de", // Germany
    fr: "fr", // France
    it: "it", // Italy
    es: "es", // Spain
    nl: "nl", // Netherlands
    gb: "gb", // UK
  }

  const countryCodes = countryMap[country] || countryMap.all

  // Try NewsAPI for European sources
  if (newsApiKey) {
    try {
      console.log("Fetching European news from NewsAPI...")
      const newsApiArticles = await fetchFromNewsAPIEurope(query, limit, sinceTimestamp, newsApiKey, countryCodes)
      articles = articles.concat(newsApiArticles)
      console.log(`Fetched ${newsApiArticles.length} European articles from NewsAPI`)
    } catch (error) {
      console.error("NewsAPI Europe error:", error)
    }
  }

  // Try GNews for European coverage
  if (gnewsApiKey && articles.length < limit) {
    try {
      console.log("Fetching European news from GNews...")
      const gnewsArticles = await fetchFromGNewsEurope(
        query,
        limit - articles.length,
        sinceTimestamp,
        gnewsApiKey,
        countryCodes,
      )
      articles = articles.concat(gnewsArticles)
      console.log(`Fetched ${gnewsArticles.length} European articles from GNews`)
    } catch (error) {
      console.error("GNews Europe error:", error)
    }
  }

  if (articles.length === 0) {
    console.log("No live European news data available, using mock data")
    return generateMockEuropeanNewsData()
  }

  // Remove duplicates and sort by date
  const uniqueArticles = articles.filter(
    (article, index, self) => index === self.findIndex((a) => a.title === article.title),
  )

  return uniqueArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

async function fetchFromNewsAPIEurope(
  query: string,
  limit: number,
  sinceTimestamp: Date,
  apiKey: string,
  countryCodes: string,
) {
  const fromDate = sinceTimestamp.toISOString().split("T")[0]

  // Enhanced European financial query
  const europeanQuery = `(${query}) AND (ECB OR "European Central Bank" OR "European Union" OR eurozone OR STOXX OR DAX OR CAC OR FTSE OR "European stocks")`

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    europeanQuery,
  )}&from=${fromDate}&sortBy=publishedAt&pageSize=${Math.min(limit, 100)}&language=en&apiKey=${apiKey}`

  console.log(`NewsAPI Europe URL: ${url.replace(apiKey, "***")}`)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "BehavioralFinanceDashboard/1.0",
    },
  })

  if (!response.ok) {
    throw new Error(`NewsAPI Europe HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status === "error") {
    throw new Error(`NewsAPI Europe Error: ${data.message}`)
  }

  return data.articles
    .filter((article: any) => {
      // Filter for European financial content
      const content = (article.title + " " + (article.description || "")).toLowerCase()
      const europeanKeywords = [
        "ecb",
        "european",
        "eurozone",
        "euro",
        "dax",
        "cac",
        "ftse",
        "stoxx",
        "germany",
        "france",
        "italy",
        "spain",
        "netherlands",
        "eu",
        "brexit",
        "draghi",
        "lagarde",
      ]
      return (
        article.title &&
        article.description &&
        !article.title.includes("[Removed]") &&
        europeanKeywords.some((keyword) => content.includes(keyword))
      )
    })
    .map((article: any) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name || "Unknown",
      url: article.url,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      country: detectCountry(article.title + " " + article.description),
    }))
}

async function fetchFromGNewsEurope(
  query: string,
  limit: number,
  sinceTimestamp: Date,
  apiKey: string,
  countryCodes: string,
) {
  // Use first country code for GNews (it doesn't support multiple countries)
  const primaryCountry = countryCodes.split(",")[0]
  const europeanQuery = `${query} ECB European stocks eurozone`

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    europeanQuery,
  )}&lang=en&country=${primaryCountry}&max=${Math.min(limit, 100)}&apikey=${apiKey}`

  console.log(`GNews Europe URL: ${url.replace(apiKey, "***")}`)

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "BehavioralFinanceDashboard/1.0",
    },
  })

  if (!response.ok) {
    throw new Error(`GNews Europe HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.errors) {
    throw new Error(`GNews Europe Error: ${data.errors.join(", ")}`)
  }

  return data.articles
    .filter((article: any) => {
      const publishedDate = new Date(article.publishedAt)
      return publishedDate >= sinceTimestamp && article.title && article.description
    })
    .map((article: any) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name || "Unknown",
      url: article.url,
      publishedAt: article.publishedAt,
      urlToImage: article.image,
      country: detectCountry(article.title + " " + article.description),
    }))
}

function detectCountry(text: string): string {
  const content = text.toLowerCase()
  if (content.includes("germany") || content.includes("german") || content.includes("dax")) return "Germany"
  if (content.includes("france") || content.includes("french") || content.includes("cac")) return "France"
  if (content.includes("italy") || content.includes("italian")) return "Italy"
  if (content.includes("spain") || content.includes("spanish")) return "Spain"
  if (content.includes("netherlands") || content.includes("dutch")) return "Netherlands"
  if (content.includes("uk") || content.includes("britain") || content.includes("ftse")) return "UK"
  return "Europe"
}

function analyzeEuropeanSentiment(text: string): number {
  if (!text || text.trim().length === 0) return 50

  const positiveWords = [
    "bull",
    "bullish",
    "buy",
    "growth",
    "profit",
    "up",
    "rise",
    "good",
    "great",
    "excellent",
    "strong",
    "rally",
    "surge",
    "boom",
    "positive",
    "optimistic",
    "confident",
    "recovery",
    "expansion",
    "stimulus",
    "support",
    "upgrade",
    "outperform",
    "beat",
    "exceed",
    "gains",
    "advance",
    "improve",
    "strengthen",
    "dovish", // ECB dovish policy
    "accommodation", // monetary accommodation
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
    "recession",
    "crisis",
    "risk",
    "warning",
    "concern",
    "trouble",
    "struggle",
    "miss",
    "disappoint",
    "downgrade",
    "cut",
    "austerity",
    "deficit",
    "debt",
    "hawkish", // ECB hawkish policy
    "tightening", // monetary tightening
    "brexit", // generally negative for EU markets
  ]

  const words = text.toLowerCase().split(/\s+/)
  let score = 50 // neutral baseline
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

  // European-specific adjustments
  if (text.toLowerCase().includes("ecb") && text.toLowerCase().includes("rate cut")) score += 10
  if (text.toLowerCase().includes("energy crisis")) score -= 15
  if (text.toLowerCase().includes("eu regulation")) score -= 5

  if (wordCount > 0) {
    const adjustment = Math.min(wordCount * 2, 25)
    if (score > 50) score = Math.min(score + adjustment, 95)
    if (score < 50) score = Math.max(score - adjustment, 5)
  }

  return Math.max(5, Math.min(95, Math.round(score)))
}

function extractEuropeanTopics(articles: any[]) {
  const topicKeywords = {
    "ECB Policy": ["ecb", "european central bank", "lagarde", "draghi", "monetary policy", "interest rate"],
    "EU Regulations": ["eu regulation", "european union", "compliance", "gdpr", "mifid", "basel"],
    "German Economy": ["germany", "german", "dax", "bundesbank", "manufacturing", "exports"],
    "French Economy": ["france", "french", "cac", "macron", "banque de france"],
    "Energy Crisis": ["energy", "gas", "oil", "renewable", "nuclear", "pipeline", "russia"],
    "Banking Sector": ["bank", "banking", "credit", "loan", "financial services", "fintech"],
    "Brexit Impact": ["brexit", "uk", "britain", "trade deal", "northern ireland"],
    "Italian Economy": ["italy", "italian", "rome", "debt", "bonds", "spread"],
    "Spanish Economy": ["spain", "spanish", "madrid", "unemployment", "tourism"],
    "Dutch Economy": ["netherlands", "dutch", "amsterdam", "aex", "trade"],
    Eurozone: ["eurozone", "euro", "currency", "inflation", "gdp", "unemployment"],
    "Green Transition": ["green", "climate", "carbon", "sustainable", "esg", "renewable energy"],
  }

  const topicCounts: Record<string, { count: number; sentiments: number[] }> = {}

  articles.forEach((article) => {
    const text = (article.title + " " + (article.description || "")).toLowerCase()

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some((keyword) => text.includes(keyword))) {
        if (!topicCounts[topic]) {
          topicCounts[topic] = { count: 0, sentiments: [] }
        }
        topicCounts[topic].count += 1
        topicCounts[topic].sentiments.push(article.sentiment)
      }
    })
  })

  return Object.entries(topicCounts)
    .map(([topic, data]) => ({
      topic,
      count: data.count,
      averageSentiment: Math.round(data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

function generateMockEuropeanNewsData() {
  const currentDate = new Date()

  return [
    {
      title: "ECB signals dovish stance as eurozone inflation moderates to 2.3%",
      description:
        "European Central Bank officials hint at potential rate cuts as inflation approaches target levels across the eurozone.",
      source: "Financial Times Europe",
      url: "https://example.com/ecb-dovish-stance",
      publishedAt: new Date(currentDate.getTime() - 2 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Europe",
    },
    {
      title: "German DAX rallies on strong manufacturing data and export growth",
      description:
        "German stocks surged following better-than-expected manufacturing PMI and robust export figures, signaling economic resilience.",
      source: "Reuters Germany",
      url: "https://example.com/german-dax-rally",
      publishedAt: new Date(currentDate.getTime() - 4 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Germany",
    },
    {
      title: "French CAC 40 declines on energy sector concerns and regulatory pressure",
      description:
        "French markets fell as energy companies face new EU regulations and concerns over winter energy supplies persist.",
      source: "Les Echos",
      url: "https://example.com/french-cac-decline",
      publishedAt: new Date(currentDate.getTime() - 6 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "France",
    },
    {
      title: "Italian banks surge on improved credit quality and ECB policy outlook",
      description:
        "Italian banking stocks rallied as non-performing loans decreased and expectations of ECB policy easing boosted sector sentiment.",
      source: "Il Sole 24 Ore",
      url: "https://example.com/italian-banks-surge",
      publishedAt: new Date(currentDate.getTime() - 8 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Italy",
    },
    {
      title: "Spanish renewable energy stocks climb on EU Green Deal funding",
      description:
        "Spanish clean energy companies gained as the EU announced additional funding for renewable energy projects under the Green Deal.",
      source: "El Economista",
      url: "https://example.com/spanish-renewable-climb",
      publishedAt: new Date(currentDate.getTime() - 10 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Spain",
    },
    {
      title: "Dutch tech stocks benefit from EU digital sovereignty initiatives",
      description:
        "Netherlands-based technology companies rose on news of increased EU investment in digital infrastructure and semiconductor manufacturing.",
      source: "Het Financieele Dagblad",
      url: "https://example.com/dutch-tech-benefit",
      publishedAt: new Date(currentDate.getTime() - 12 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Netherlands",
    },
    {
      title: "STOXX Europe 600 reaches new highs on corporate earnings optimism",
      description:
        "European stocks hit record levels as Q4 earnings season begins with several companies beating analyst expectations.",
      source: "Bloomberg Europe",
      url: "https://example.com/stoxx-new-highs",
      publishedAt: new Date(currentDate.getTime() - 14 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "Europe",
    },
    {
      title: "Brexit trade tensions weigh on UK-EU cross-border investments",
      description:
        "Ongoing Brexit-related trade disputes continue to impact investment flows between the UK and European Union markets.",
      source: "Financial News London",
      url: "https://example.com/brexit-trade-tensions",
      publishedAt: new Date(currentDate.getTime() - 16 * 3600000).toISOString(),
      urlToImage: "https://placeholder.svg?height=200&width=300",
      country: "UK",
    },
  ]
}
