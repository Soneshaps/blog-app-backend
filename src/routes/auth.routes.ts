import { Router } from 'express'
import {
    createUserController,
    loginController,
} from '../controllers/auth.controller'
import { validateRequest } from '../middlewares.ts/validateRequest'
import {
    createUserSchema,
    loginUserSchema,
} from '../validators/auth.validators'

const router = Router()

router.post(
    '/createUser',
    validateRequest(createUserSchema),
    createUserController
)
router.post('/login', validateRequest(loginUserSchema), loginController)

export default router
