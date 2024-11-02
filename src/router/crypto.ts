import { Router } from "express";
import { getCryptoPrice } from "../controller/cryto";

export default (router: Router) => {
    router.get("/crypto/getCryptoPrice", getCryptoPrice);
};
