import { type NextRequest, NextResponse } from "next/server"

// Financial data API integration (Alpha Vantage, Yahoo Finance, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || ["SPY", "QQQ", "AAPL", "MSFT", "GOOGL"]

    // Using Alpha Vantage API (free tier available)
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY

    if (!apiKey) {
      throw new Error("Alpha Vantage API key not configured")
    }

    const stockData = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          // Get quote data
          const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
          const quoteResponse = await fetch(quoteUrl)
          const quoteData = await quoteResponse.json()

          const quote = quoteData["Global Quote"]
          if (!quote) {
            throw new Error(`No data for symbol ${symbol}`)
          }

          // Get company overview for additional metrics
          const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
          const overviewResponse = await fetch(overviewUrl)
          const overviewData = await overviewResponse.json()

          return {
            symbol: symbol,
            price: Number.parseFloat(quote["05. price"]),
            change: Number.parseFloat(quote["09. change"]),
            changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
            volume: Number.parseInt(quote["06. volume"]),
            marketCap: overviewData.MarketCapitalization ? Number.parseInt(overviewData.MarketCapitalization) : null,
            pe: overviewData.PERatio ? Number.parseFloat(overviewData.PERatio) : null,
            eps: overviewData.EPS ? Number.parseFloat(overviewData.EPS) : null,
            dividendYield: overviewData.DividendYield ? Number.parseFloat(overviewData.DividendYield) : null,
            timestamp: new Date().toISOString(),
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error)
          return null
        }
      }),
    )

    const validData = stockData.filter((data) => data !== null)

    return NextResponse.json({
      stocks: validData,
      metadata: {
        requestedSymbols: symbols,
        successfulFetches: validData.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Financial API error:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}
