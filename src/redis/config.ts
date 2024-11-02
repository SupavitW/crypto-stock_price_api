// redisConfig
import * as redis from "redis";
import dotenv from "dotenv";

dotenv.config();
// Declare type for redis instance
let redisConn: redis.RedisClientType;

const host = process.env.REDIS_HOST || "localhost";
const port = parseInt(process.env.REDIS_PORT || "6379");

const initRedis = async () => {
    redisConn = redis.createClient({
        socket: {
            host,
            port,
        },
    });
    redisConn.on("error", (err) => console.log(`Redis Client Error: ${err}`));
    await redisConn.connect();
    console.log("Connected to redis");
};

const getRedisClient = (): redis.RedisClientType => {
    return redisConn; // Return the instance or null
};

export { initRedis, getRedisClient };
