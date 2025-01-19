import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../services/auth.service'

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
        res.status(401).json({ error: 'No token provided' })
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
        res.status(401).json({ error: 'Invalid token' })
    }
}
