// API client configurations and utilities
export const API_ENDPOINTS = {
  reddit: "/api/reddit",
  twitter: "/api/twitter",
  financial: "/api/financial",
  sentiment: "/api/sentiment",
  fearGreed: "/api/fear-greed",
  shillerPE: "/api/shiller-pe",
  news: "/api/news",
}

export interface RedditPost {
  id: string
  title: string
  selftext: string
  score: number
  num_comments: number
  created_utc: number
  subreddit: string
  sentiment?: number
  author?: string
}

export interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
  }
  sentiment?: number
}

export interface NewsArticle {
  title: string
  description: string
  source: string
  url: string
  publishedAt: string
  urlToImage?: string
  sentiment?: number
}

export interface FinancialData {
  symbol: string
  price: number
  change: number
  changePercent: number
  marketCap?: number
  pe?: number
  eps?: number
}

export interface SentimentData {
  platform: "reddit" | "twitter" | "google" | "news"
  sentiment: number
  timestamp: string
  topic?: string
  mentions?: number
}

// Enhanced error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
    public isRetryable = true,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching ${url} (attempt ${attempt + 1}/${maxRetries + 1})`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "BehavioralFinanceDashboard/1.0.0",
          ...options?.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        throw new APIError(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
          response.status,
          url,
          response.status >= 500 || response.status === 429, // Retry on server errors or rate limits
        )
      }

      const data = await response.json()
      console.log(`Successfully fetched data from ${url}`)
      return data
    } catch (error) {
      lastError = error as Error
      console.log(`Attempt ${attempt + 1} failed for ${url}:`, error)

      // Don't retry on the last attempt or if error is not retryable
      if (attempt === maxRetries || (error instanceof APIError && !error.isRetryable)) {
        break
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // If all retries failed, throw the last error
  if (lastError instanceof APIError) {
    throw lastError
  }

  throw new APIError(
    `Network error after ${maxRetries + 1} attempts: ${lastError?.message || "Unknown error"}`,
    0,
    url,
    false,
  )
}
