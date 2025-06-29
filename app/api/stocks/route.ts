import { type NextRequest, NextResponse } from "next/server"

// Enhanced stock data API using Financial Modeling Prep (better free tier)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || ["SPY"]
    const includeOptions = searchParams.get("options") === "true"
    const includeTechnicals = searchParams.get("technicals") === "true"

    console.log(`Fetching stock data for: ${symbols.join(", ")}`)

    const fmpApiKey = process.env.FMP_API_KEY // Financial Modeling Prep
    const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY

    if (!fmpApiKey && !alphaVantageKey) {
      console.log("No stock API keys available, returning mock data")
      return NextResponse.json({
        stocks: generateMockStockData(symbols),
        metadata: {
          symbols,
          timestamp: new Date().toISOString(),
          error: "Live data unavailable - API keys not configured. Showing sample data.",
          dataQuality: "mock",
        },
      })
    }

    // Fetch data for each symbol with individual error handling
    const stockData = await Promise.allSettled(
      symbols.map(async (symbol) => {
        try {
          console.log(`Processing ${symbol}...`)

          let stockInfo = null
          let quoteData = null
          let technicalData = null

          // Try Financial Modeling Prep first (better free tier)
          if (fmpApiKey) {
            try {
              const fmpData = await fetchFromFMP(symbol, fmpApiKey, includeTechnicals)
              stockInfo = fmpData.profile
              quoteData = fmpData.quote
              technicalData = fmpData.technicals
            } catch (fmpError) {
              console.log(`FMP failed for ${symbol}, trying Alpha Vantage:`, fmpError)
            }
          }

          // Fallback to Alpha Vantage if FMP fails
          if (!quoteData && alphaVantageKey) {
            try {
              const avData = await fetchFromAlphaVantage(symbol, alphaVantageKey, includeTechnicals)
              quoteData = avData.quote
              stockInfo = avData.overview
              technicalData = avData.technicals
            } catch (avError) {
              console.log(`Alpha Vantage failed for ${symbol}:`, avError)
            }
          }

          // If no live data, use mock data for this symbol
          if (!quoteData) {
            console.log(`No live data available for ${symbol}, using mock data`)
            const mockStock = generateMockStockData([symbol])[0]
            return {
              ...mockStock,
              dataQuality: "mock",
              error: "Live data unavailable",
            }
          }

          return {
            symbol: symbol.toUpperCase(),
            name: stockInfo?.name || stockInfo?.companyName || `${symbol.toUpperCase()} Stock`,
            sector: stockInfo?.sector || "Unknown",
            industry: stockInfo?.industry || "Unknown",
            price: Number.parseFloat(quoteData.price || "0"),
            change: Number.parseFloat(quoteData.change || "0"),
            changePercent: Number.parseFloat(quoteData.changePercent || "0"),
            volume: Number.parseInt(quoteData.volume || "0"),
            marketCap: stockInfo?.marketCap || null,
            pe: stockInfo?.pe || null,
            eps: stockInfo?.eps || null,
            dividendYield: stockInfo?.dividendYield || null,
            beta: stockInfo?.beta || null,
            week52High: stockInfo?.week52High || null,
            week52Low: stockInfo?.week52Low || null,
            technicals: technicalData,
            options: null,
            timestamp: new Date().toISOString(),
            dataQuality: "live",
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error)
          // Return mock data for this symbol on error
          const mockStock = generateMockStockData([symbol])[0]
          return {
            ...mockStock,
            dataQuality: "mock",
            error: `Live data unavailable: ${error instanceof Error ? error.message : "Unknown error"}`,
          }
        }
      }),
    )

    // Process results and separate successful from failed
    const processedStocks = stockData.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        console.error(`Failed to fetch ${symbols[index]}:`, result.reason)
        const mockStock = generateMockStockData([symbols[index]])[0]
        return {
          ...mockStock,
          dataQuality: "mock",
          error: `Failed to fetch live data: ${result.reason?.message || "Unknown error"}`,
        }
      }
    })

    const liveDataCount = processedStocks.filter((stock) => stock.dataQuality === "live").length
    const mockDataCount = processedStocks.filter((stock) => stock.dataQuality === "mock").length

    return NextResponse.json({
      stocks: processedStocks,
      metadata: {
        symbols,
        timestamp: new Date().toISOString(),
        dataQuality: liveDataCount > 0 ? (mockDataCount > 0 ? "mixed" : "live") : "mock",
        liveDataCount,
        mockDataCount,
        message:
          liveDataCount === 0
            ? "All data is simulated due to API issues"
            : mockDataCount > 0
              ? `${liveDataCount} live, ${mockDataCount} simulated`
              : "All data is live",
      },
    })
  } catch (error) {
    console.error("Stock API error:", error)

    // Return mock data on complete failure
    const symbols = request.nextUrl.searchParams.get("symbols")?.split(",") || ["SPY"]
    return NextResponse.json({
      stocks: generateMockStockData(symbols),
      metadata: {
        symbols,
        timestamp: new Date().toISOString(),
        error: `Stock API temporarily unavailable: ${error instanceof Error ? error.message : "Unknown error"}`,
        dataQuality: "mock",
      },
    })
  }
}

async function fetchFromFMP(symbol: string, apiKey: string, includeTechnicals: boolean) {
  console.log(`Fetching ${symbol} from Financial Modeling Prep`)

  // Fetch real-time quote
  const quoteUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
  const quoteResponse = await fetch(quoteUrl, { signal: AbortSignal.timeout(10000) })

  if (!quoteResponse.ok) {
    throw new Error(`FMP Quote API HTTP ${quoteResponse.status}`)
  }

  const quoteData = await quoteResponse.json()
  if (!quoteData || quoteData.length === 0) {
    throw new Error(`No quote data for ${symbol} from FMP`)
  }

  const quote = quoteData[0]

  // Fetch company profile
  let profile = null
  try {
    const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`
    const profileResponse = await fetch(profileUrl, { signal: AbortSignal.timeout(8000) })
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      if (profileData && profileData.length > 0) {
        profile = profileData[0]
      }
    }
  } catch (error) {
    console.log(`Profile data not available for ${symbol}:`, error)
  }

  // Fetch technical indicators if requested
  let technicals = null
  if (includeTechnicals) {
    try {
      technicals = await fetchFMPTechnicals(symbol, apiKey)
    } catch (error) {
      console.log(`Technical data not available for ${symbol}:`, error)
    }
  }

  return {
    quote: {
      price: quote.price?.toString(),
      change: quote.change?.toString(),
      changePercent: quote.changesPercentage?.toString(),
      volume: quote.volume?.toString(),
    },
    profile: profile
      ? {
          name: profile.companyName,
          sector: profile.sector,
          industry: profile.industry,
          marketCap: profile.mktCap,
          pe: profile.pe,
          eps: profile.eps,
          dividendYield: profile.lastDiv ? (profile.lastDiv / quote.price) * 100 : null,
          beta: profile.beta,
          week52High: profile.range ? Number.parseFloat(profile.range.split("-")[1]) : null,
          week52Low: profile.range ? Number.parseFloat(profile.range.split("-")[0]) : null,
        }
      : null,
    technicals,
  }
}

async function fetchFMPTechnicals(symbol: string, apiKey: string) {
  try {
    // Fetch RSI
    const rsiUrl = `https://financialmodelingprep.com/api/v3/technical_indicator/1day/${symbol}?period=14&type=rsi&apikey=${apiKey}`
    const rsiResponse = await fetch(rsiUrl, { signal: AbortSignal.timeout(8000) })

    // Fetch SMA for MACD approximation
    const smaUrl = `https://financialmodelingprep.com/api/v3/technical_indicator/1day/${symbol}?period=12&type=sma&apikey=${apiKey}`
    const smaResponse = await fetch(smaUrl, { signal: AbortSignal.timeout(8000) })

    let rsi = null
    let macd = null

    if (rsiResponse.ok) {
      const rsiData = await rsiResponse.json()
      if (rsiData && rsiData.length > 0) {
        rsi = rsiData[0].rsi
      }
    }

    if (smaResponse.ok) {
      const smaData = await smaResponse.json()
      if (smaData && smaData.length > 1) {
        // Approximate MACD using SMA difference
        macd = smaData[0].sma - smaData[1].sma
      }
    }

    return {
      rsi: rsi ? Number.parseFloat(rsi) : null,
      macd: macd ? Number.parseFloat(macd.toString()) : null,
      macdSignal: null, // Not available in free tier
      macdHist: null, // Not available in free tier
    }
  } catch (error) {
    console.error(`Error fetching FMP technicals for ${symbol}:`, error)
    return null
  }
}

async function fetchFromAlphaVantage(symbol: string, apiKey: string, includeTechnicals: boolean) {
  console.log(`Fetching ${symbol} from Alpha Vantage`)

  // Get real-time quote
  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
  const quoteResponse = await fetch(quoteUrl, { signal: AbortSignal.timeout(10000) })

  if (!quoteResponse.ok) {
    throw new Error(`Alpha Vantage HTTP ${quoteResponse.status}`)
  }

  const quoteData = await quoteResponse.json()

  if (quoteData.Note || quoteData.Information) {
    throw new Error(`Alpha Vantage API limit: ${quoteData.Note || quoteData.Information}`)
  }

  const quote = quoteData["Global Quote"]
  if (!quote || Object.keys(quote).length === 0) {
    throw new Error(`No quote data for ${symbol} from Alpha Vantage`)
  }

  // Get company overview
  let overview = null
  try {
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    const overviewResponse = await fetch(overviewUrl, { signal: AbortSignal.timeout(8000) })
    if (overviewResponse.ok) {
      overview = await overviewResponse.json()
    }
  } catch (error) {
    console.log(`Overview data not available for ${symbol}:`, error)
  }

  // Get technical indicators if requested
  let technicals = null
  if (includeTechnicals) {
    try {
      technicals = await fetchAlphaVantageTechnicals(symbol, apiKey)
    } catch (error) {
      console.log(`Technical data not available for ${symbol}:`, error)
    }
  }

  return {
    quote: {
      price: quote["05. price"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"]?.replace("%", ""),
      volume: quote["06. volume"],
    },
    overview: overview
      ? {
          name: overview.Name,
          sector: overview.Sector,
          industry: overview.Industry,
          marketCap: overview.MarketCapitalization ? Number.parseInt(overview.MarketCapitalization) : null,
          pe: overview.PERatio ? Number.parseFloat(overview.PERatio) : null,
          eps: overview.EPS ? Number.parseFloat(overview.EPS) : null,
          dividendYield: overview.DividendYield ? Number.parseFloat(overview.DividendYield) : null,
          beta: overview.Beta ? Number.parseFloat(overview.Beta) : null,
          week52High: overview["52WeekHigh"] ? Number.parseFloat(overview["52WeekHigh"]) : null,
          week52Low: overview["52WeekLow"] ? Number.parseFloat(overview["52WeekLow"]) : null,
        }
      : null,
    technicals,
  }
}

async function fetchAlphaVantageTechnicals(symbol: string, apiKey: string) {
  try {
    // Fetch RSI
    const rsiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`
    const rsiResponse = await fetch(rsiUrl, { signal: AbortSignal.timeout(8000) })
    const rsiData = await rsiResponse.json()

    // Fetch MACD
    const macdUrl = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`
    const macdResponse = await fetch(macdUrl, { signal: AbortSignal.timeout(8000) })
    const macdData = await macdResponse.json()

    // Get latest values
    const rsiValues = rsiData["Technical Analysis: RSI"]
    const macdValues = macdData["Technical Analysis: MACD"]

    const latestDate = Object.keys(rsiValues || {})[0]
    const latestMacdDate = Object.keys(macdValues || {})[0]

    return {
      rsi: rsiValues?.[latestDate]?.["RSI"] ? Number.parseFloat(rsiValues[latestDate]["RSI"]) : null,
      macd: macdValues?.[latestMacdDate]?.["MACD"] ? Number.parseFloat(macdValues[latestMacdDate]["MACD"]) : null,
      macdSignal: macdValues?.[latestMacdDate]?.["MACD_Signal"]
        ? Number.parseFloat(macdValues[latestMacdDate]["MACD_Signal"])
        : null,
      macdHist: macdValues?.[latestMacdDate]?.["MACD_Hist"]
        ? Number.parseFloat(macdValues[latestMacdDate]["MACD_Hist"])
        : null,
    }
  } catch (error) {
    console.error(`Error fetching Alpha Vantage technicals for ${symbol}:`, error)
    return null
  }
}

function generateMockStockData(symbols: string[]) {
  const mockData = {
    AAPL: {
      name: "Apple Inc.",
      sector: "Technology",
      price: 185.25,
      change: 2.15,
      volume: 45000000,
      pe: 28.5,
      beta: 1.2,
    },
    MSFT: {
      name: "Microsoft Corporation",
      sector: "Technology",
      price: 378.9,
      change: -1.25,
      volume: 32000000,
      pe: 32.1,
      beta: 0.9,
    },
    GOOGL: {
      name: "Alphabet Inc.",
      sector: "Technology",
      price: 142.8,
      change: 3.45,
      volume: 28000000,
      pe: 25.8,
      beta: 1.1,
    },
    TSLA: {
      name: "Tesla Inc.",
      sector: "Consumer Cyclical",
      price: 248.5,
      change: -8.75,
      volume: 85000000,
      pe: 65.2,
      beta: 2.1,
    },
    NVDA: {
      name: "NVIDIA Corporation",
      sector: "Technology",
      price: 875.3,
      change: 15.2,
      volume: 42000000,
      pe: 68.5,
      beta: 1.7,
    },
    SPY: { name: "SPDR S&P 500 ETF", sector: "ETF", price: 485.2, change: 1.85, volume: 55000000, pe: 21.5, beta: 1.0 },
    QQQ: {
      name: "Invesco QQQ Trust",
      sector: "ETF",
      price: 395.75,
      change: 2.3,
      volume: 38000000,
      pe: 28.2,
      beta: 1.2,
    },
    VTI: {
      name: "Vanguard Total Stock Market ETF",
      sector: "ETF",
      price: 245.6,
      change: 1.2,
      volume: 25000000,
      pe: 22.1,
      beta: 1.0,
    },
  }

  return symbols.map((symbol) => {
    const base = mockData[symbol as keyof typeof mockData] || mockData.SPY
    const changePercent = (base.change / (base.price - base.change)) * 100

    return {
      symbol: symbol.toUpperCase(),
      name: base.name,
      sector: base.sector,
      industry: "Sample Industry",
      price: base.price,
      change: base.change,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: base.volume,
      marketCap: Math.round(base.price * 1000000000),
      pe: base.pe,
      eps: Math.round((base.price / base.pe) * 100) / 100,
      dividendYield: Math.round(Math.random() * 3 * 100) / 100,
      beta: base.beta,
      week52High: Math.round(base.price * 1.25 * 100) / 100,
      week52Low: Math.round(base.price * 0.75 * 100) / 100,
      technicals: {
        rsi: Math.round((Math.random() * 40 + 30) * 100) / 100,
        macd: Math.round((Math.random() * 2 - 1) * 100) / 100,
        macdSignal: Math.round((Math.random() * 2 - 1) * 100) / 100,
        macdHist: Math.round((Math.random() * 1 - 0.5) * 100) / 100,
      },
      options: null,
      timestamp: new Date().toISOString(),
    }
  })
}
