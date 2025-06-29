"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchWithErrorHandling, APIError, API_ENDPOINTS } from "@/lib/api-clients"

interface UseDataOptions {
  refreshInterval?: number
  enabled?: boolean
}

export function useLiveData<T>(endpoint: string, options: UseDataOptions = {}) {
  const { refreshInterval = 60000, enabled = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setError(null)
      const result = await fetchWithErrorHandling<T>(endpoint)
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      const errorMessage = err instanceof APIError ? `${err.message} (${err.endpoint})` : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled])

  useEffect(() => {
    fetchData()

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  const refetch = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
  }
}

// Specific hooks for different data types
export function useRedditData(subreddit?: string) {
  const endpoint = `${API_ENDPOINTS.reddit}${subreddit ? `?subreddit=${subreddit}` : ""}`
  return useLiveData(endpoint, { refreshInterval: 300000 }) // 5 minutes
}

export function useTwitterData(query?: string) {
  const endpoint = `${API_ENDPOINTS.twitter}${query ? `?query=${encodeURIComponent(query)}` : ""}`
  return useLiveData(endpoint, { refreshInterval: 180000 }) // 3 minutes
}

export function useNewsData(query?: string, hours?: number) {
  const params = new URLSearchParams()
  if (query) params.append("query", query)
  if (hours) params.append("hours", hours.toString())
  const endpoint = `${API_ENDPOINTS.news}${params.toString() ? `?${params.toString()}` : ""}`
  return useLiveData(endpoint, { refreshInterval: 900000 }) // 15 minutes
}

export function useFinancialData(symbols?: string[]) {
  const endpoint = `${API_ENDPOINTS.financial}${symbols ? `?symbols=${symbols.join(",")}` : ""}`
  return useLiveData(endpoint, { refreshInterval: 60000 }) // 1 minute
}

export function useFearGreedData() {
  return useLiveData(API_ENDPOINTS.fearGreed, { refreshInterval: 3600000 }) // 1 hour
}

export function useShillerPEData() {
  return useLiveData(API_ENDPOINTS.shillerPE, { refreshInterval: 86400000 }) // 24 hours
}

export function useStockData(symbols: string[], options?: { technicals?: boolean }) {
  const params = new URLSearchParams()
  params.append("symbols", symbols.join(","))
  if (options?.technicals) params.append("technicals", "true")

  const endpoint = `/api/stocks?${params.toString()}`
  return useLiveData(endpoint, { refreshInterval: 30000 }) // 30 seconds
}

export function useMacroCorrelations(symbols: string[], period = "1y") {
  const endpoint = `/api/macro-correlations?symbols=${symbols.join(",")}&period=${period}`
  return useLiveData(endpoint, { refreshInterval: 300000 }) // 5 minutes
}

// European market hooks
export function useEuropeanNewsData(country = "all", hours = 24) {
  const params = new URLSearchParams()
  params.append("country", country)
  params.append("hours", hours.toString())

  const endpoint = `/api/eu-news?${params.toString()}`
  return useLiveData(endpoint, { refreshInterval: 900000 }) // 15 minutes
}

export function useEuropeanStockData(symbols: string[], technicals = true) {
  const params = new URLSearchParams()
  params.append("symbols", symbols.join(","))
  if (technicals) params.append("technicals", "true")

  const endpoint = `/api/eu-stocks?${params.toString()}`
  return useLiveData(endpoint, { refreshInterval: 30000 }) // 30 seconds
}

// Default export for backward compatibility
export default useLiveData
