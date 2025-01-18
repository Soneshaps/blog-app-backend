import { createClient } from 'redis'
import logger from './logger'

const redisHost = process.env.REDIS_HOST || 'redis'
const redisPort = Number(process.env.REDIS_PORT) || 6379

const redisClient = createClient({
    socket: {
        host: redisHost,
        port: redisPort,
    },
})

async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect()
            logger.info('Connected to Redis')
        }
    } catch (err) {
        logger.info('Failed to connect Redis', err)
    }
}

export { redisClient, connectRedis }
