import axios from "axios";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.FINNHUB_API_KEY; // Replace with your actual API key

// Function to get the stock ticker from the company name
export const getStockTickerFromCompanyName = async (companyName: string) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search`, {
            params: {
                q: companyName,
                token: API_KEY,
            },
        });

        const data = response.data;

        if (data && data.result && data.result.length > 0) {
            // Extract the first result's symbol
            return data.result[0].symbol;
        } else {
            return null; // No match found
        }
    } catch (error) {
        console.error("Error fetching ticker:", error);
        return null;
    }
};

interface Coin {
    name: string;
    symbol: string;
}

// Function to get the name of the cryptocurrency by ticker symbol
export const getCoinNameByTicker = async (ticker: string) => {
    const filePath = path.join(__dirname, "cryptos.json"); // Adjust path as needed
    try {
        const data = await fs.promises.readFile(filePath, "utf-8");
        const coins = JSON.parse(data);
        console.log(coins);
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
