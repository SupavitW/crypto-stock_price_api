import yahooFinance from "yahoo-finance2";
import { getRedisClient } from "../../redis/config";
import { getStockTickerFromCompanyName } from "../../utils";

export const returnStockPrice = async (search: string, option: string) => {
    try {
        let stockInfo;
        let query;
        const redisClient = getRedisClient();
        if (typeof search === "string") {
            // When single ticker is provided
            if (option === "company") {
                query = (await getStockTickerFromCompanyName(search)) as string; // change company name to ticker
            } else {
                query = search.toUpperCase();
            }
            if (!query) return null;

            const cachedData = await redisClient.get(`stock_${query}`); // Check if data is cached
            if (cachedData) {
                stockInfo = JSON.parse(cachedData);
            } else {
                // No data found in cache
                stockInfo = await yahooFinance.quote(query);

                if (!stockInfo) return null;

                let result = {
                    ticker_symbol: query,
                    display_Name: stockInfo.displayName || stockInfo.longName,
                    currency: stockInfo.currency,
                    current_price: stockInfo.regularMarketPrice,
                    previous_close: stockInfo.regularMarketPreviousClose,
                    open_price: stockInfo.regularMarketOpen,
                    price_change: stockInfo.regularMarketChange,
                    price_change_percent: stockInfo.regularMarketChangePercent,
                    day_high: stockInfo.regularMarketDayHigh,
                    day_low: stockInfo.regularMarketDayLow,
                    fiftytwo_week_high: stockInfo.fiftyTwoWeekHigh,
                    fiftytwo_week_low: stockInfo.fiftyTwoWeekLow,
                    bid_price: stockInfo.bid,
                    ask_price: stockInfo.ask,
                    volume: stockInfo.regularMarketVolume,
                    average_volume_three_months:
                        stockInfo.averageDailyVolume3Month,
                };
                await redisClient.set(
                    // Cache the data
                    `stock_${query}`,
                    JSON.stringify(result),
                    { EX: 30 }, // 30 seconds expiry
                );
                stockInfo = result;
            }
            return stockInfo;
        } else if (Array.isArray(search)) {
            // When multiple tickers are provided
            stockInfo = [];

            for (const tickerItem of search as string) {
                if (option === "company") {
                    query = (await getStockTickerFromCompanyName(
                        tickerItem,
                    )) as string; // change company name to ticker
                } else query = tickerItem.toUpperCase();

                if (!query) continue; // no ticker found from company name

                const cachedData = await redisClient.get(`stock_${query}`); // Check if data is cached

                if (cachedData) {
                    // Found cache
                    stockInfo.push(JSON.parse(cachedData));
                } else {
                    // No data found in cache
                    const object = await yahooFinance.quote(query);
                    if (!object) {
                        // Case when one of the ticker is not found
                        continue;
                    }

                    let result = {
                        ticker_symbol: query,
                        display_Name: object.displayName,
                        currency: object.currency,
                        current_price: object.regularMarketPrice,
                        previous_close: object.regularMarketPreviousClose,
                        open_price: object.regularMarketOpen,
                        price_change: object.regularMarketChange,
                        price_change_percent: object.regularMarketChangePercent,
                        day_high: object.regularMarketDayHigh,
                        day_low: object.regularMarketDayLow,
                        fiftytwo_week_high: object.fiftyTwoWeekHigh,
                        fiftytwo_week_low: object.fiftyTwoWeekLow,
                        bid_price: object.bid,
                        ask_price: object.ask,
                        volume: object.regularMarketVolume,
                        average_volume_three_months:
                            object.averageDailyVolume3Month,
                    };
                    await redisClient.set(
                        // Cache the data
                        `stock_${query}`,
                        JSON.stringify(result),
                        { EX: 30 },
                    );
                    stockInfo.push(result);
                }
            }

            if (stockInfo.length === 0) return null;

            return stockInfo;
        }
    } catch (error) {
        throw error;
    }
};
