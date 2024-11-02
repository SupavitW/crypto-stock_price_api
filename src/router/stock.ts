import { Router } from "express";
import { getStockPriceByTicker } from "../controller/stock";

export default (router: Router) => {
    router.get("/stock/getStockPrice", getStockPriceByTicker);
};
