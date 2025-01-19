// src/services/auth.service.test.ts

import { createUser, loginUser, JWT_SECRET } from '../auth.service'
import { findUserByEmail } from '../../services/user.service'
import { createUserFor } from '../../models/auth.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Mock the dependencies
jest.mock('../../services/user.service', () => ({
    findUserByEmail: jest.fn(),
}))

jest.mock('../../models/auth.model', () => ({
    createUserFor: jest.fn(),
}))

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}))

describe('Auth Service', () => {
    const mockEmail = 'test@example.com'
    const mockUsername = 'testuser'
    const mockPassword = 'password123'
    const mockHash = 'hashedPassword'
    const mockUserId = 'user-123'

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createUser', () => {
        it('should create a new user if email not found', async () => {
            // Arrange
            ;(findUserByEmail as jest.Mock).mockResolvedValue(null)
            ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHash)
            ;(createUserFor as jest.Mock).mockResolvedValue(null)

            // Act
            const result = await createUser(
                mockUsername,
                mockEmail,
                mockPassword
            )

            // Assert
            expect(findUserByEmail).toHaveBeenCalledWith(mockEmail)
            expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10)
            expect(createUserFor).toHaveBeenCalledWith(
                mockUsername,
                mockEmail,
                mockHash
            )
            expect(result).toEqual({ message: 'Successfully Created a user' })
        })

        it('should throw an error if user already exists', async () => {
            // Arrange
            ;(findUserByEmail as jest.Mock).mockResolvedValue({
                email: mockEmail,
            })

            // Act && Assert
            await expect(
                createUser(mockUsername, mockEmail, mockPassword)
            ).rejects.toThrow('User already exists')
        })

        it('should throw a generic 500 error if something unexpected happens', async () => {
            // Assert
            ;(findUserByEmail as jest.Mock).mockRejectedValue(
                new Error('DB down')
            )

            await expect(
                createUser(mockUsername, mockEmail, mockPassword)
            ).rejects.toThrow('Error while creating a user')
        })
    })

    describe('loginUser', () => {
        it('should login successfully and return a token', async () => {
            // Arrange
            const mockUser = {
                userId: mockUserId,
                username: mockUsername,
                passwordHash: mockHash,
            }
            ;(findUserByEmail as jest.Mock).mockResolvedValue(mockUser)
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
            ;(jwt.sign as jest.Mock).mockReturnValue('mockToken')

            // Act
            const result = await loginUser(mockEmail, mockPassword)

            // Assert
            expect(findUserByEmail).toHaveBeenCalledWith(mockEmail)
            expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash)
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUserId, username: mockUsername },
                JWT_SECRET,
                { expiresIn: '1h' }
            )
            expect(result).toEqual({ token: 'mockToken' })
        })

        it('should throw if user not found', async () => {
            // Arrange
            ;(findUserByEmail as jest.Mock).mockResolvedValue(null)

            // Act && Assert
            await expect(loginUser(mockEmail, mockPassword)).rejects.toThrow(
                'User not found'
            )
        })

        it('should throw if password is invalid', async () => {
            // Arrange
            ;(findUserByEmail as jest.Mock).mockResolvedValue({
                userId: mockUserId,
                username: mockUsername,
                passwordHash: mockHash,
            })
            ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

            // Assertion
            await expect(loginUser(mockEmail, mockPassword)).rejects.toThrow(
                'Invalid credentials'
            )
        })

        it('should throw a 500 if something unexpected happens', async () => {
            // Arrange
            ;(findUserByEmail as jest.Mock).mockRejectedValue(
                new Error('DB error')
            )

            // Act & Assert
            await expect(loginUser(mockEmail, mockPassword)).rejects.toThrow(
                'Error while logging user'
            )
        })
    })
})
