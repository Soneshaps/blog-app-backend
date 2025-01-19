import { Request, Response } from 'express'
import { AppError } from '../utils/appError'

export function errorHandler(err: AppError, req: Request, res: Response) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            stack: err.stack,
        },
    })
}
