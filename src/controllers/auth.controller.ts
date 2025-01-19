import { Request, Response } from 'express'
import { createUser, loginUser } from '../services/auth.service'

export async function createUserController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { username, email, password } = req.body
        const newItem = await createUser(username, email, password)
        return res.status(201).json(newItem)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function loginController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { email, password } = req.body
        const newItem = await loginUser(email, password)
        return res.status(201).json(newItem)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}
