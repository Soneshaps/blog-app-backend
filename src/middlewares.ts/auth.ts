import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../services/auth.service'
import { sendResponse } from '../utils/response'

export interface AuthRequest extends Request {
    user?: { userId: string; username: string }
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ')) {
        sendResponse(res, 401, { message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string
            username: string
        }
        req.user = { userId: decoded.userId, username: decoded.username }
        next()
    } catch {
        sendResponse(res, 401, { message: 'Invalid token' })
    }
}
