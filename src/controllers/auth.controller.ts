import { Request, Response } from 'express'
import { createUser, loginUser } from '../services/auth.service'
import { sendResponse } from '../utils/response'

export async function createUserController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { username, email, password } = req.body
        const result = await createUser(username, email, password)

        sendResponse(res, 201, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function loginController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { email, password } = req.body
        const result = await loginUser(email, password)

        sendResponse(res, 201, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}
