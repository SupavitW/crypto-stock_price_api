import { Router } from "express";
import stock from "./stock";
import crypto from "./crypto";

const router = Router();

export default (): Router => {
    stock(router);
    crypto(router);
    return router;
};
