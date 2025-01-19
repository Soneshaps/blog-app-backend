import { dynamoDb, TABLE_NAME } from '../models/article.model'

const USER_EMAIL_INDEX = 'GSI_UserEmail'

export async function findUserByEmail(email: string) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: USER_EMAIL_INDEX,
        KeyConditionExpression: 'email = :emailVal',
        ExpressionAttributeValues: {
            ':emailVal': email,
        },
        Limit: 1,
    }

    const result = await dynamoDb.query(params).promise()
    if (result.Items && result.Items.length > 0) {
        return result.Items[0]
    }
    return null
}
