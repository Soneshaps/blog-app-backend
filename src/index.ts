import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import articleRoutes from './routes/articleRoutes'

const app: Application = express()
const port = 8000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use('/api/article', articleRoutes)

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
