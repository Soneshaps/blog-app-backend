import bcrypt from 'bcrypt'
import { findUserByEmail } from './user.service'
import logger from '../utils/logger'
import { createUserFor } from '../models/auth.model'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/appError'

const SALT_ROUNDS = 10
export const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key'

export async function createUser(
    username: string,
    email: string,
    plainPassword: string
) {
    try {
        logger.info('Initializing Creating user with payload', {
            username,
            email,
        })

        logger.info('Find if user exist for :', { email })

        const existing = await findUserByEmail(email)
        if (existing) {
            logger.error('User already exist for :', { username, email })

            throw new AppError('User already exists', 400)
        }

        logger.info('Encrypting password')

        const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS)

        logger.info('Creating a user')

        await createUserFor(username, email, passwordHash)
        logger.info('Successfully Created a user')

        return { message: 'Successfully Created a user' }
    } catch (err) {
        logger.error('Error while creating a user :', err)

        throw err instanceof AppError
            ? err
            : new AppError('Error while creating a user', 500)
    }
}

export async function loginUser(email: string, plainPassword: string) {
    try {
        logger.info('Find if user exist for :', { email })

        const user = await findUserByEmail(email)
        if (!user) {
            logger.error('User not found for :', { email })

            throw new AppError('User not found', 404)
        }

        logger.info('Validating password')

        const isValid = await bcrypt.compare(plainPassword, user.passwordHash)
        if (!isValid) {
            logger.error('Invalid credentials')

            throw new AppError('Invalid credentials', 400)
        }

        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        return { token: token }
    } catch (err) {
        logger.error('Error while login user :', err)

        throw err instanceof AppError
            ? err
            : new AppError('Error while logging user', 500)
    }
}
