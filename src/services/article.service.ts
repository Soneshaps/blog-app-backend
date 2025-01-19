import { v4 as uuidv4 } from 'uuid'
import {
    createArticleItem,
    getArticleItem,
    updateArticleItem,
    deleteArticleItem,
    listArticlesByUser,
    listAllArticlesSortedByDate,
} from '../models/article.model'
import logger from '../utils/logger'
import { redisClient } from '../utils/redisClient'
import { AppError } from '../utils/appError'

/**
 * Create a new Article
 */
export async function createArticle(
    userId: string,
    title: string,
    content: string
) {
    try {
        if (!userId || !title || !content) {
            logger.info('Missing Required field to create a new article')
            throw new AppError('Missing required fields.', 400)
        }
        logger.info('Creating a new article for userId:', { userId })

        logger.info('Generating unique articleId and timestamp')

        const articleId = uuidv4()
        const timestamp = new Date().toISOString()

        logger.info('Inserting a new article row in table')
        const item = await createArticleItem(userId, articleId, {
            title,
            content,
            createdAt: timestamp,
            updatedAt: timestamp,
        })

        logger.info('Successfully created a new article :', item)

        return item
    } catch (err) {
        logger.error('Failed to Create a new article:', err)

        throw err instanceof AppError
            ? err
            : new AppError('Failed to Create a new article', 500)
    }
}

/**
 * Get a single article
 */
export async function getArticle(userId: string, articleId: string) {
    try {
        if (!userId || !articleId) {
            logger.error('Missing Required field to create a new article')

            throw new AppError(
                'Missing Required field to create a new article.',
                400
            )
        }

        const cacheKey = `article:${articleId}`

        // Check cacheKey in cache
        const cached = await redisClient.get(cacheKey)
        if (cached) {
            logger.info('Fetching a article for cache', { cacheKey })

            return JSON.parse(cached)
        }

        logger.info('Fetching a article for id: ', { articleId, userId })

        const article = await getArticleItem(userId, articleId)

        // Store in cache
        await redisClient.set(cacheKey, JSON.stringify(article), {
            EX: 3600, // 1 hour
        })

        return article
    } catch (err) {
        logger.error('Failed to fetch article for user:', err)

        throw err instanceof AppError
            ? err
            : new AppError('Failed to fetch article for user', 500)
    }
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
    try {
        if (!userId || !articleId || !title || !content) {
            logger.error('Missing Required field to update the article')
            throw new AppError('Missing required fields.', 400)
        }

        logger.info('Updating a article for id: ', { articleId })
        const updated = await updateArticleItem(userId, articleId, {
            title,
            content,
        })

        if (updated) {
            const cacheKey = `article:${articleId}`
            await redisClient.del(cacheKey)
        }

        return updated
    } catch (err) {
        logger.error('Failed to update the article:', err)

        throw err instanceof AppError
            ? err
            : new AppError('Failed to update the article', 500)
    }
}

/**
 * Delete an article
 */
export async function deleteArticle(userId: string, articleId: string) {
    try {
        if (!userId || !articleId) {
            logger.error('Missing Required field to delete the article')
            throw new AppError('Missing userId or articleId.', 400)
        }

        logger.info('Deleting a article for id: ', { articleId })

        await deleteArticleItem(userId, articleId)

        const cacheKey = `article:${articleId}`
        await redisClient.del(cacheKey)

        logger.info('Deleted article Successfully', { articleId })

        return { message: 'Article Deleted Successfully' }
    } catch (err) {
        logger.error('Failed to delete the article:', err)

        throw err instanceof AppError
            ? err
            : new AppError('Failed to delete the article', 500)
    }
}

/**
 * List all articles for a user
 */
export async function listArticles(userId: string) {
    try {
        if (!userId) {
            logger.error('Missing Required field to fetch the articles')

            throw new AppError('Missing userId.', 400)
        }
        logger.info('Listing all article for userId: ', { userId })

        return await listArticlesByUser(userId)
    } catch (err) {
        logger.error('Failed to fetch all article for the user:', err)

        throw err instanceof AppError
            ? err
            : new AppError('Failed to fetch all article for the user', 500)
    }
}

export async function listArticlesGlobalByDate() {
    try {
        // TODO: limiting results.
        logger.info('Listing all articles')

        return await listAllArticlesSortedByDate()
    } catch (err) {
        logger.error('Failed to fetch global article:', err)

        throw new AppError('Failed to fetch global article', 500)
    }
}
