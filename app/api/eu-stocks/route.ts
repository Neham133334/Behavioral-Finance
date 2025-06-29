import { type NextRequest, NextResponse } from "next/server"

// European stocks API with live data integration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || getDefaultEuropeanStocks()
    const technicals = searchParams.get("technicals") === "true"

    console.log(`Fetching European stock data for: ${symbols.join(", ")}`)

    const fmpApiKey = process.env.FMP_API_KEY
    const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY

    if (!fmpApiKey && !alphaVantageApiKey) {
      console.log("No stock API keys available, returning mock data")
      return NextResponse.json({
        stocks: generateMockEuropeanStockData(symbols),
        metadata: {
          symbols,
          timestamp: new Date().toISOString(),
          dataQuality: "mock",
          message: "All European stock data is simulated - API keys not configured",
          error: "No API keys available for live data",
        },
      })
    }

    const stockData = await fetchEuropeanStockData(symbols, technicals, fmpApiKey, alphaVantageApiKey)

    return NextResponse.json({
      stocks: stockData.stocks,
      metadata: {
        symbols,
        timestamp: new Date().toISOString(),
        dataQuality: stockData.dataQuality,
        message: stockData.message,
        liveCount: stockData.liveCount,
        mockCount: stockData.mockCount,
      },
    })
  } catch (error) {
    console.error("European stocks API error:", error)

    const symbols = request.nextUrl.searchParams.get("symbols")?.split(",") || getDefaultEuropeanStocks()
    return NextResponse.json({
      stocks: generateMockEuropeanStockData(symbols),
      metadata: {
        symbols,
        timestamp: new Date().toISOString(),
        dataQuality: "mock",
        message: "All European stock data is simulated due to API error",
        error: `API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    })
  }
}

function getDefaultEuropeanStocks(): string[] {
  return ["ASML.AS", "SAP.DE", "LVMH.PA", "NESN.SW", "NOVO-B.CO", "TTE.PA", "UNA.AS", "SIE.DE"]
}

async function fetchEuropeanStockData(
  symbols: string[],
  includeTechnicals: boolean,
  fmpApiKey?: string,
  alphaVantageApiKey?: string,
) {
  const stocks = []
  let liveCount = 0
  let mockCount = 0

  for (const symbol of symbols) {
    try {
      let stockData = null

      // Try Financial Modeling Prep first (better European coverage)
      if (fmpApiKey) {
        try {
          stockData = await fetchFromFMPEurope(symbol, includeTechnicals, fmpApiKey)
          if (stockData) {
            liveCount++
            console.log(`Successfully fetched live data for ${symbol} from FMP`)
          }
        } catch (error) {
          console.error(`FMP error for ${symbol}:`, error)
        }
      }

      // Fallback to Alpha Vantage if FMP fails
      if (!stockData && alphaVantageApiKey) {
        try {
          stockData = await fetchFromAlphaVantageEurope(symbol, alphaVantageApiKey)
          if (stockData) {
            liveCount++
            console.log(`Successfully fetched live data for ${symbol} from Alpha Vantage`)
          }
        } catch (error) {
          console.error(`Alpha Vantage error for ${symbol}:`, error)
        }
      }

      // Use mock data if all APIs fail
      if (!stockData) {
        stockData = generateMockEuropeanStock(symbol)
        stockData.dataQuality = "mock"
        stockData.error = "Live data unavailable"
        mockCount++
        console.log(`Using mock data for ${symbol}`)
      }

      stocks.push(stockData)
    } catch (error) {
      console.error(`Error processing ${symbol}:`, error)
      const mockStock = generateMockEuropeanStock(symbol)
      mockStock.dataQuality = "mock"
      mockStock.error = `Processing error: ${error instanceof Error ? error.message : "Unknown error"}`
      stocks.push(mockStock)
      mockCount++
    }
  }

  const dataQuality = liveCount === symbols.length ? "live" : mockCount === symbols.length ? "mock" : "mixed"
  const message =
    dataQuality === "live"
      ? "All European stock data is live"
      : dataQuality === "mock"
        ? "All European stock data is simulated"
        : `${liveCount} live, ${mockCount} simulated European stocks`

  return { stocks, dataQuality, message, liveCount, mockCount }
}

async function fetchFromFMPEurope(symbol: string, includeTechnicals: boolean, apiKey: string) {
  // Financial Modeling Prep has good European stock coverage
  const quoteUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
  const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`

  console.log(`Fetching European stock ${symbol} from FMP`)

  const [quoteResponse, profileResponse] = await Promise.all([
    fetch(quoteUrl, { signal: AbortSignal.timeout(10000) }),
    fetch(profileUrl, { signal: AbortSignal.timeout(10000) }),
  ])

  if (!quoteResponse.ok) {
    throw new Error(`FMP quote API error: ${quoteResponse.status}`)
  }

  const quoteData = await quoteResponse.json()
  const profileData = profileResponse.ok ? await profileResponse.json() : []

  if (!quoteData || quoteData.length === 0) {
    throw new Error("No quote data available from FMP")
  }

  const quote = quoteData[0]
  const profile = profileData[0] || {}

  // Calculate technical indicators if requested
  let technicals = null
  if (includeTechnicals) {
    try {
      technicals = await fetchTechnicalIndicators(symbol, apiKey)
    } catch (error) {
      console.error(`Technical indicators error for ${symbol}:`, error)
      technicals = generateMockTechnicals()
    }
  }

  return {
    symbol: quote.symbol,
    name: profile.companyName || quote.name || symbol,
    price: quote.price || 0,
    change: quote.change || 0,
    changePercent: quote.changesPercentage || 0,
    volume: quote.volume || 0,
    marketCap: quote.marketCap || profile.mktCap || null,
    pe: quote.pe || null,
    eps: quote.eps || null,
    beta: profile.beta || null,
    dividendYield: quote.dividendYield || 0,
    week52High: quote.yearHigh || null,
    week52Low: quote.yearLow || null,
    sector: profile.sector || "Unknown",
    country: detectEuropeanCountry(symbol),
    exchange: profile.exchangeShortName || detectExchange(symbol),
    currency: profile.currency || detectCurrency(symbol),
    technicals: technicals,
    dataQuality: "live",
  }
}

async function fetchFromAlphaVantageEurope(symbol: string, apiKey: string) {
  // Alpha Vantage global quote for European stocks
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`

  console.log(`Fetching European stock ${symbol} from Alpha Vantage`)

  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })

  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`)
  }

  const data = await response.json()

  if (data["Error Message"] || data["Note"] || data["Information"]) {
    throw new Error(data["Error Message"] || data["Note"] || data["Information"])
  }

  const quote = data["Global Quote"]
  if (!quote || Object.keys(quote).length === 0) {
    throw new Error("No quote data available from Alpha Vantage")
  }

  const price = Number.parseFloat(quote["05. price"]) || 0
  const previousClose = Number.parseFloat(quote["08. previous close"]) || price
  const change = price - previousClose
  const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0

  return {
    symbol: quote["01. symbol"],
    name: getEuropeanCompanyName(symbol),
    price: price,
    change: change,
    changePercent: changePercent,
    volume: Number.parseInt(quote["06. volume"]) || 0,
    marketCap: null, // Not available in global quote
    pe: null,
    eps: null,
    beta: null,
    dividendYield: 0,
    week52High: Number.parseFloat(quote["03. high"]) || null,
    week52Low: Number.parseFloat(quote["04. low"]) || null,
    sector: "Unknown",
    country: detectEuropeanCountry(symbol),
    exchange: detectExchange(symbol),
    currency: detectCurrency(symbol),
    technicals: null,
    dataQuality: "live",
  }
}

async function fetchTechnicalIndicators(symbol: string, apiKey: string) {
  try {
    // Fetch RSI and MACD from FMP
    const rsiUrl = `https://financialmodelingprep.com/api/v3/technical_indicator/daily/${symbol}?period=14&type=rsi&apikey=${apiKey}`
    const macdUrl = `https://financialmodelingprep.com/api/v3/technical_indicator/daily/${symbol}?period=12&type=macd&apikey=${apiKey}`

    const [rsiResponse, macdResponse] = await Promise.all([
      fetch(rsiUrl, { signal: AbortSignal.timeout(8000) }),
      fetch(macdUrl, { signal: AbortSignal.timeout(8000) }),
    ])

    const rsiData = rsiResponse.ok ? await rsiResponse.json() : []
    const macdData = macdResponse.ok ? await macdResponse.json() : []

    return {
      rsi: rsiData[0]?.rsi || null,
      macd: macdData[0]?.macd || null,
      macdSignal: macdData[0]?.macdSignal || null,
      macdHistogram: macdData[0]?.macdHistogram || null,
    }
  } catch (error) {
    console.error("Technical indicators fetch error:", error)
    return generateMockTechnicals()
  }
}

function detectEuropeanCountry(symbol: string): string {
  if (symbol.endsWith(".AS")) return "Netherlands"
  if (symbol.endsWith(".DE")) return "Germany"
  if (symbol.endsWith(".PA")) return "France"
  if (symbol.endsWith(".L")) return "UK"
  if (symbol.endsWith(".SW")) return "Switzerland"
  if (symbol.endsWith(".CO")) return "Denmark"
  if (symbol.endsWith(".ST")) return "Sweden"
  if (symbol.endsWith(".OL")) return "Norway"
  if (symbol.endsWith(".MI")) return "Italy"
  if (symbol.endsWith(".MC")) return "Spain"
  return "Europe"
}

function detectExchange(symbol: string): string {
  if (symbol.endsWith(".AS")) return "Euronext Amsterdam"
  if (symbol.endsWith(".DE")) return "XETRA"
  if (symbol.endsWith(".PA")) return "Euronext Paris"
  if (symbol.endsWith(".L")) return "London Stock Exchange"
  if (symbol.endsWith(".SW")) return "SIX Swiss Exchange"
  if (symbol.endsWith(".CO")) return "Nasdaq Copenhagen"
  if (symbol.endsWith(".ST")) return "Nasdaq Stockholm"
  if (symbol.endsWith(".OL")) return "Oslo Børs"
  if (symbol.endsWith(".MI")) return "Borsa Italiana"
  if (symbol.endsWith(".MC")) return "BME Spanish Exchanges"
  return "European Exchange"
}

function detectCurrency(symbol: string): string {
  if (symbol.endsWith(".SW")) return "CHF"
  if (symbol.endsWith(".L")) return "GBP"
  if (symbol.endsWith(".CO")) return "DKK"
  if (symbol.endsWith(".ST")) return "SEK"
  if (symbol.endsWith(".OL")) return "NOK"
  return "EUR" // Most European stocks trade in EUR
}

function getEuropeanCompanyName(symbol: string): string {
  const companyNames: Record<string, string> = {
    "ASML.AS": "ASML Holding N.V.",
    "SAP.DE": "SAP SE",
    "LVMH.PA": "LVMH Moët Hennessy Louis Vuitton",
    "NESN.SW": "Nestlé S.A.",
    "NOVO-B.CO": "Novo Nordisk A/S",
    "TTE.PA": "TotalEnergies SE",
    "UNA.AS": "Unilever N.V.",
    "SIE.DE": "Siemens AG",
    "MC.PA": "LVMH",
    "OR.PA": "L'Oréal S.A.",
    "AIR.PA": "Airbus SE",
    "SAN.PA": "Sanofi S.A.",
    "BNP.PA": "BNP Paribas S.A.",
    "AZN.L": "AstraZeneca PLC",
    "SHEL.L": "Shell plc",
    "UL.L": "Unilever PLC",
    "VOD.L": "Vodafone Group Plc",
    "BP.L": "BP p.l.c.",
  }
  return companyNames[symbol] || symbol.replace(/\.[A-Z]+$/, "")
}

function generateMockTechnicals() {
  return {
    rsi: 45 + Math.random() * 30, // 45-75 range
    macd: (Math.random() - 0.5) * 2, // -1 to 1 range
    macdSignal: (Math.random() - 0.5) * 1.8,
    macdHistogram: (Math.random() - 0.5) * 0.4,
  }
}

function generateMockEuropeanStock(symbol: string) {
  const basePrice = 50 + Math.random() * 200
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100

  return {
    symbol,
    name: getEuropeanCompanyName(symbol),
    price: basePrice,
    change: change,
    changePercent: changePercent,
    volume: Math.floor(Math.random() * 10000000) + 100000,
    marketCap: Math.floor(Math.random() * 500000000000) + 10000000000,
    pe: 15 + Math.random() * 25,
    eps: 2 + Math.random() * 8,
    beta: 0.8 + Math.random() * 0.8,
    dividendYield: Math.random() * 5,
    week52High: basePrice * (1.1 + Math.random() * 0.3),
    week52Low: basePrice * (0.7 + Math.random() * 0.2),
    sector: ["Technology", "Healthcare", "Consumer Goods", "Financials", "Energy"][Math.floor(Math.random() * 5)],
    country: detectEuropeanCountry(symbol),
    exchange: detectExchange(symbol),
    currency: detectCurrency(symbol),
    technicals: generateMockTechnicals(),
    dataQuality: "mock",
  }
}

function generateMockEuropeanStockData(symbols: string[]) {
  return symbols.map((symbol) => generateMockEuropeanStock(symbol))
}
