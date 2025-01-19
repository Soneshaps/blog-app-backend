import { Response } from 'express'

export function sendResponse(res: Response, statusCode: number, data: any) {
    res.status(statusCode).json({
        success: statusCode < 400,
        data: statusCode < 400 ? data : null,
        error: statusCode >= 400 ? data : null,
    })
}
