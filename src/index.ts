import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import articleRoutes from './routes/article.routes'
import authRoutes from './routes/auth.routes'

import logger from './utils/logger'
import { connectRedis } from './utils/redisClient'
import { errorHandler } from './middlewares.ts/errorHandler'

const app: Application = express()
const port = 8000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/articles', articleRoutes)

app.use('/auth', authRoutes)

// Error Handling Middleware
app.use(errorHandler)

export async function startServer() {
    try {
        await connectRedis()

        app.listen(port, () => {
            logger.info(`Server is running on http://localhost:${port}`)
        })
    } catch (error) {
        logger.error('Failed to start server:', error)
        process.exit(1)
    }
}
