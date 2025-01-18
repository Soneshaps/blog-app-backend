import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import articleRoutes from './routes/article.routes'
import logger from './utils/logger'
import { connectRedis } from './utils/redisClient'

const app: Application = express()
const port = 8000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/articles', articleRoutes)

// Error Handling Middleware
app.use((err: any, req: Request, res: Response) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    })
})

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
