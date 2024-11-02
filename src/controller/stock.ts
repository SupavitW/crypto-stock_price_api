import { Request, Response } from "express";
import { returnStockPrice } from "../service/stock/";

export const getStockPriceByTicker = async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const option = req.query.option as string;

    // Check input correctness
    if (!search) {
        res.status(400).json({ error: "Search input is required" });
        return;
    }

    if (!option) {
        res.status(400).json({ error: "Option is required" });
        return;
    }

    if (
        typeof option !== "string" ||
        (option.toLowerCase() !== "company" &&
            option.toLowerCase() !== "ticker")
    ) {
        res.status(400).json({ error: "Invalid option provided" });
        return;
    }

    try {
        // Fetch stock data using yahoo-finance
        const stockPrice = await returnStockPrice(search, option);

        // Case when data is not found
        if (!stockPrice) {
            res.status(400).json({
                error: `No data found for provided ${option}`,
            });
            return;
        }

        // Send the current price back in the response
        res.status(200).json(stockPrice);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error getting stock data: ${error}`);
    }
};
