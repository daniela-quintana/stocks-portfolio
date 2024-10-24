import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Spinner from "./components/Spinner";

class Stock {
  constructor(public symbol: string, private prices: { [date: string]: number }) {}

  Price(date: string): number {
    return this.prices[date] || 0;
  }
}

class Portfolio {
  constructor(private stocks: Stock[]) {}

  Profit(startDate: string, endDate: string): number {
    let totalProfit = 0;

    this.stocks.forEach((stock) => {
      const startPrice = stock.Price(startDate);
      const endPrice = stock.Price(endDate);
      totalProfit += endPrice - startPrice;
    });
    return totalProfit;
  }

  AnnualizedReturn(startDate: string, endDate: string): number {
    const years = this.getYearsBetween(startDate, endDate);
    const startPrice = this.stocks[0].Price(startDate);
    const endPrice = this.stocks[0].Price(endDate);

    if (years > 0 && startPrice > 0) {
      return Math.pow(endPrice / startPrice, 1 / years) - 1;
    }
    return 0;
  }

  private getYearsBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  }
}

const App: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>("AAPL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [profit, setProfit] = useState<number>(0);
  const [annualizedReturn, setAnnualizedReturn] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("2020-01-01");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiSecret = import.meta.env.VITE_API_SECRET;
  const initialStocks = ["AAPL", "AMZN", "IBM", "GOOGL"];

  const fetchStock = useCallback(async (symbol: string, start: string, end: string) => {
    setLoading(true);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    };

    try {
      const responseStart = await fetch(
        `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&timeframe=1Day&start=${start}&limit=1`,
        options
      );

      const responseEnd = await fetch(
        `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&timeframe=1Day&start=${end}&limit=1`,
        options
      );

      const dataStart = await responseStart.json();
      const dataEnd = await responseEnd.json();

      if (responseStart.ok && responseEnd.ok) {
        const startPrice = dataStart.bars[symbol][0]?.o || 0;
        const endPrice = dataEnd.bars[symbol][0]?.o || 0;

        const stockPrices = new Stock(symbol, {
          [startDate]: startPrice,
          [endDate]: endPrice,
        });

        setStocks((prevStocks) => {
          const existingStockIndex = prevStocks.findIndex((s) => s.symbol === symbol);
          if (existingStockIndex !== -1) {
            const updatedStocks = [...prevStocks];
            updatedStocks[existingStockIndex] = stockPrices;
            return updatedStocks;
          } else {
            return [...prevStocks, stockPrices];
          }
        });
        setError("");
      } else {
        setError(`Error fetching data for ${symbol}: ${dataStart.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error fetching stock bars:", err);
      setError("Error fetching stock bars");
    } finally {
      setLoading(false);
    }
  }, [apiKey, apiSecret, startDate, endDate]);

  useEffect(() => {
    const formattedStart = new Date(startDate).toISOString();
    const formattedEnd = new Date(endDate).toISOString();
    fetchStock(selectedStock, formattedStart, formattedEnd);
  }, [fetchStock, selectedStock, startDate, endDate]);

  useEffect(() => {
    if (stocks.length > 0 && selectedStock) {
      const selected = stocks.find((stock) => stock.symbol === selectedStock);
      if (selected) {
        const portfolio = new Portfolio([selected]);
        const profitValue = portfolio.Profit(startDate, endDate);
        const annualizedValue = portfolio.AnnualizedReturn(startDate, endDate);
        setProfit(profitValue);
        setAnnualizedReturn(annualizedValue);
      }
    }
  }, [stocks, selectedStock, startDate, endDate]);

  useEffect(() => {
    const fetchRandomName = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?nat=US");
        const data = await response.json();
        const randomName = `${data.results[0].name.first}`;
        setName(randomName);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchRandomName();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <header className="header">
            <img src="../public/fintual.svg" alt="Logo de Fintual" />
            <h1>Stocks Portfolio</h1>
            <h3>Hello {name} 👋</h3>
          </header>

          <main>
            <div className="stock-selector">
              <label htmlFor="stocks" className="label">
                Stocks
              </label>
              <select
                id="stocks"
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="select"
              >
                <option value="" disabled>
                  Select a stock
                </option>
                {initialStocks.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-info">
              <div className="card-date">
                <div className="date-selector">
                  <label htmlFor="start-date" className="label">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>

              <div className="card-date">
                <div className="date-selector">
                  <label htmlFor="end-date" className="label">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-input"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            <section className="portfolio-info">
              <div className="card">
                <h2>Profit</h2>
                <p>
                  Between <b>{formatDate(startDate)}</b> and{" "}
                  <b>{formatDate(endDate)}</b>:{" "}
                  <span className="profit-value">${profit.toFixed(2)}</span>{" "}
                </p>
              </div>
              <div className="card">
                <h2>Annualized Return</h2>
                <p>
                  Annualized Return:{" "}
                  <span className="return-value">
                    {(annualizedReturn * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            </section>

            {error && <p className="error">{error}</p>}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
