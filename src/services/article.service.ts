import { v4 as uuidv4 } from 'uuid'
import {
    createArticleItem,
    getArticleItem,
    updateArticleItem,
    deleteArticleItem,
    listArticlesByUser,
    listAllArticlesSortedByDate,
} from '../models/article.model'

/**
 * Create a new Article
 */
export async function createArticle(
    userId: string,
    title: string,
    content: string
) {
    // 1) Validate input, or do any business logic needed
    if (!userId || !title || !content) {
        throw new Error('Missing required fields.')
    }

    // 2) Generate unique articleId & timestamps
    const articleId = uuidv4()
    const now = new Date().toISOString()

    // 3) Call the model to persist in DynamoDB
    const item = await createArticleItem(userId, articleId, {
        title,
        content,
        createdAt: now,
        updatedAt: now,
    })

    return item
}

/**
 * Get a single article
 */
export async function getArticle(userId: string, articleId: string) {
    if (!userId || !articleId) {
        throw new Error('Missing userId or articleId.')
    }
    return await getArticleItem(userId, articleId)
}

/**
 * Update an existing article
 */
export async function updateArticle(
    userId: string,
    articleId: string,
    title: string,
    content: string
) {
    if (!userId || !articleId || !title || !content) {
        throw new Error('Missing required fields.')
    }
    return await updateArticleItem(userId, articleId, { title, content })
}

/**
 * Delete an article
 */
export async function deleteArticle(userId: string, articleId: string) {
    if (!userId || !articleId) {
        throw new Error('Missing userId or articleId.')
    }
    await deleteArticleItem(userId, articleId)
}

/**
 * List all articles for a user
 */
export async function listArticles(userId: string) {
    if (!userId) {
        throw new Error('Missing userId.')
    }
    return await listArticlesByUser(userId)
}

export async function listArticlesGlobalByDate() {
    // Any business logic you want here.
    // E.g., authentication checks, or limiting results.
    return await listAllArticlesSortedByDate()
}
