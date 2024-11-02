import { Request, Response } from "express";
import { returnCryptoPrice } from "../service/crypto/";

export const getCryptoPrice = async (req: Request, res: Response) => {
    let search = req.query.search as string;
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
        (option.toLowerCase() !== "name" && option.toLowerCase() !== "ticker")
    ) {
        res.status(400).json({ error: "Invalid option provided" });
        return;
    }

    if (search.includes(" ")) {
        res.status(400).json({ error: "Search input cannot contain spaces" });
        return;
    }

    try {
        // Fetch crypto data using CoinGecko
        const cryptoPrice = await returnCryptoPrice(search, option);
        // Case when data is not found
        if (!cryptoPrice) {
            res.status(200).json({
                message: `No data found for provided ${option}`,
            });
            return;
        }
        // Send the current price back in the response
        res.status(200).json(cryptoPrice);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error getting cryto data: ${error}`);
    }
};
