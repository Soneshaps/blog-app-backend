import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake',
})

const TABLE_NAME = 'BlogApp'

/**
 * Utility to build the Partition Key for a user.
 */
function buildUserPK(userId: string): string {
    return `USER#${userId}`
}

/**
 * Utility to build the Sort Key for an article.
 */
function buildArticleSK(articleId: string): string {
    return `ARTICLE#${articleId}`
}

/**
 * Create a new article in DynamoDB.
 */
export async function createArticleItem(
    userId: string,
    articleId: string,
    data: {
        title: string
        content: string
        createdAt: string
        updatedAt: string
    }
) {
    const item = {
        PK: buildUserPK(userId),
        SK: buildArticleSK(articleId),
        type: 'Article',
        articleId,
        ...data, // merges { title, content, createdAt, updatedAt }
    }

    await dynamoDb
        .put({
            TableName: TABLE_NAME,
            Item: item,
        })
        .promise()

    return item
}

/**
 * Get a single article by userId + articleId.
 */
export async function getArticleItem(userId: string, articleId: string) {
    const result = await dynamoDb
        .get({
            TableName: TABLE_NAME,
            Key: {
                PK: buildUserPK(userId),
                SK: buildArticleSK(articleId),
            },
        })
        .promise()

    return result.Item
}

/**
 * Update an existing article.
 */
export async function updateArticleItem(
    userId: string,
    articleId: string,
    data: { title: string; content: string }
) {
    const updatedAt = new Date().toISOString()

    const result = await dynamoDb
        .update({
            TableName: TABLE_NAME,
            Key: {
                PK: buildUserPK(userId),
                SK: buildArticleSK(articleId),
            },
            UpdateExpression: `
      SET #t = :title,
          #c = :content,
          updatedAt = :updatedAt
    `,
            ExpressionAttributeNames: {
                '#t': 'title',
                '#c': 'content',
            },
            ExpressionAttributeValues: {
                ':title': data.title,
                ':content': data.content,
                ':updatedAt': updatedAt,
            },
            ReturnValues: 'ALL_NEW',
        })
        .promise()

    return result.Attributes
}

/**
 * Delete an article.
 */
export async function deleteArticleItem(userId: string, articleId: string) {
    await dynamoDb
        .delete({
            TableName: TABLE_NAME,
            Key: {
                PK: buildUserPK(userId),
                SK: buildArticleSK(articleId),
            },
        })
        .promise()
}

/**
 * List all articles for a given user.
 */
export async function listArticlesByUser(userId: string) {
    const result = await dynamoDb
        .query({
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
            ExpressionAttributeValues: {
                ':pk': buildUserPK(userId),
                ':prefix': 'ARTICLE#',
            },
        })
        .promise()

    return result.Items || []
}

const GSI_NAME = 'GSI_Articles_By_Created' // match your actual index name

// ...

/**
 * List all articles (across all users) sorted by createdAt
 */
export async function listAllArticlesSortedByDate() {
    const params = {
        TableName: TABLE_NAME,
        IndexName: GSI_NAME,
        // We want only items where type = "Article"
        KeyConditionExpression: '#type = :articleVal',
        ExpressionAttributeNames: {
            '#type': 'type',
        },
        ExpressionAttributeValues: {
            ':articleVal': 'Article',
        },
        // false => descending order (newest first)
        // true => ascending order (oldest first)
        ScanIndexForward: false,
    }

    const result = await dynamoDb.query(params).promise()
    return result.Items || []
}
