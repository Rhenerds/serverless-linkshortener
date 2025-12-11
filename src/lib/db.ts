import Redis from 'ioredis';

const getClient = () => {
    if (process.env.REDIS_URL) {
        return new Redis(process.env.REDIS_URL);
    }
    return new Redis();
};

const globalForRedis = global as unknown as { redis: Redis };
const client = globalForRedis.redis || getClient();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = client;

export const db = {
    set: async (key: string, value: any) => {
        return await client.set(key, value);
    },
    get: async <T>(key: string): Promise<T | null> => {
        const val = await client.get(key);
        if (val === null) return null;

        if (!isNaN(Number(val)) && val !== '') {
            return Number(val) as unknown as T;
        }
        return val as unknown as T;
    },
    incr: async (key: string) => {
        return await client.incr(key);
    },
    lpush: async (key: string, ...values: any[]) => {
        // Redis expects strings for list values
        const stringValues = values.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v));
        return await client.lpush(key, ...stringValues);
    },
    lrange: async <T>(key: string, start: number, end: number): Promise<T[]> => {
        const res = await client.lrange(key, start, end);
        return res.map(item => {
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        }) as unknown as T[];
    },
    hset: async (key: string, value: Record<string, any>) => {
        return await client.hset(key, value);
    },
    hgetall: async <T>(key: string): Promise<T> => {
        return await client.hgetall(key) as unknown as T;
    }
};
