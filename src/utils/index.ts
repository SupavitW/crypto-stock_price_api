import yahooFinance from "yahoo-finance2";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { Quote, Coin } from "../types";
dotenv.config();

// Function to get the stock ticker from the company name
export const getStockTickerFromCompanyName = async (companyName: string) => {
    try {
        const results = await yahooFinance.search(companyName);

        if (results.quotes.length === 0) {
            return null;
        } else {
            const bestMatch = results.quotes[0] as Quote; // Type assertion to avoid TS error
            return bestMatch.symbol;
        }
    } catch (error) {
        console.error("Error fetching ticker:", error);
        return null;
    }
};

// Function to get the name of the cryptocurrency by ticker symbol
export const getCoinNameByTicker = async (ticker: string) => {
    const filePath = path.join(__dirname, "cryptos.json"); // Adjust path as needed
    try {
        const data = await fs.promises.readFile(filePath, "utf-8");
        const coins = JSON.parse(data);

        const coin = coins.find(
            (coin: Coin) => coin.symbol.toUpperCase() === ticker.toUpperCase(),
        );

        if (coin) {
            return coin.name.toLowerCase(); // Return the name if found
        } else {
            return null; // Return null if not found
        }
    } catch (error) {
        console.error("Error reading the JSON file:", error);
        return null;
    }
};
