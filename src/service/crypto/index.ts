import CoinGecko from "coingecko-api";
import { getRedisClient } from "../../redis/config";
import { getCoinNameByTicker } from "../../utils";

export const returnCryptoPrice = async (search: string, option: string) => {
    try {
        let cryptoInfo;
        let query;
        const CoinGeckoClient = new CoinGecko();
        const redisClient = getRedisClient();

        if (typeof search === "string") {
            // When single ticker is provided
            if (option === "ticker") {
                query = await getCoinNameByTicker(search);
            } else {
                query = search.toLowerCase();
            }
            if (!query) return null;
            const cachedData = await redisClient.get(`crypto_${query}`); // Check if data is cached
            if (cachedData) {
                cryptoInfo = JSON.parse(cachedData);
            } else {
                // No data found in cache
                cryptoInfo = await CoinGeckoClient.coins.fetch(query, {});

                if (!cryptoInfo || cryptoInfo.code === 404) return null;

                if (cryptoInfo.code === 429) return "Rate limit exceeded";

                let result = {
                    name: cryptoInfo.data.name,
                    symbol: cryptoInfo.data.symbol,
                    currency: "USD",
                    current_price:
                        cryptoInfo.data.market_data.current_price.usd,
                    market_cap: cryptoInfo.data.market_data.market_cap.usd,
                    total_volume: cryptoInfo.data.market_data.total_volume.usd,
                    total_supply: cryptoInfo.data.market_data.total_supply,
                    circulating_supply:
                        cryptoInfo.data.market_data.circulating_supply,
                };
                await redisClient.set(
                    // Cache the data
                    `crypto_${query}`,
                    JSON.stringify(result),
                    { EX: 30 }, // 30 seconds expiry
                );
                cryptoInfo = result;
            }
            return cryptoInfo;
        } else if (Array.isArray(search)) {
            // When multiple tickers are provided
            cryptoInfo = [];
            for (const item of search as string) {
                if (option === "ticker") {
                    query = await getCoinNameByTicker(item);
                } else {
                    query = item.toLowerCase();
                }
                if (!query) continue;
                const cachedData = await redisClient.get(`crypto_${query}`); // Check if data is cached

                if (cachedData) {
                    cryptoInfo.push(JSON.parse(cachedData));
                } else {
                    // No data found in cache
                    const object = await CoinGeckoClient.coins.fetch(query, {});
                    if (!object || object.code === 404) continue;

                    if (object.code === 429) return "Rate limit exceeded";

                    let result = {
                        name: object.data.name,
                        symbol: object.data.symbol,
                        currency: "USD",
                        current_price:
                            object.data.market_data.current_price.usd,
                        market_cap: object.data.market_data.market_cap.usd,
                        total_volume: object.data.market_data.total_volume.usd,
                        total_supply: object.data.market_data.total_supply,
                        circulating_supply:
                            object.data.market_data.circulating_supply,
                    };
                    await redisClient.set(
                        // Cache the data
                        `crypto_${query}`,
                        JSON.stringify(result),
                        { EX: 30 }, // 30 seconds expiry
                    );
                    cryptoInfo.push(result);
                }
            }
            if (cryptoInfo.length === 0) return null;
        }

        return cryptoInfo;
    } catch (error) {
        throw error;
    }
};
