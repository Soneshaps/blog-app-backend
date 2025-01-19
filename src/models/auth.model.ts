import { v4 as uuidv4 } from 'uuid'
import { dynamoDb } from './article.model'

export async function createUserFor(
    username: string,
    email: string,
    passwordHash: string
) {
    const userId = uuidv4()

    const now = new Date().toISOString()
    const item = {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
        type: 'User',
        userId,
        username,
        email,
        passwordHash,
        createdAt: now,
    }

    return await dynamoDb.put({ TableName: 'BlogApp', Item: item }).promise()
}
