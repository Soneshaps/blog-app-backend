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
            throw new Error('Missing required fields.')
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
        throw new Error('Failed to Create a new article')
    }
}

/**
 * Get a single article
 */
export async function getArticle(userId: string, articleId: string) {
    try {
        if (!userId || !articleId) {
            logger.error('Missing Required field to create a new article')
        }

        const cacheKey = `article:${articleId}`

        // Check cacheKey in cache
        const cached = await redisClient.get(cacheKey)
        if (cached) {
            logger.info('Fetching a article for cache', { cacheKey })

            return JSON.parse(cached)
        }

        logger.info('Fetching a article for id: ', { articleId })

        const article = await getArticleItem(userId, articleId)

        // Store in cache
        await redisClient.set(cacheKey, JSON.stringify(article), {
            EX: 3600, // 1 hour
        })

        return article
    } catch (err) {
        logger.error('Failed to fetch article for user:', err)
        throw new Error('Failed to fetch article for user')
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
            throw new Error('Missing required fields.')
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
        throw new Error('Failed to update the article')
    }
}

/**
 * Delete an article
 */
export async function deleteArticle(userId: string, articleId: string) {
    try {
        if (!userId || !articleId) {
            logger.error('Missing Required field to delete the article')
            throw new Error('Missing userId or articleId.')
        }
        logger.info('Deleting a article for id: ', { articleId })

        await deleteArticleItem(userId, articleId)
    } catch (err) {
        logger.error('Failed to delete the article:', err)
        throw new Error('Failed to delete the article')
    }
}

/**
 * List all articles for a user
 */
export async function listArticles(userId: string) {
    try {
        if (!userId) {
            logger.error('Missing Required field to fetch the articles')

            throw new Error('Missing userId.')
        }
        logger.info('Listing a article for userId: ', { userId })

        return await listArticlesByUser(userId)
    } catch (err) {
        logger.error('Failed to fetch all article for the user:', err)
        throw new Error('Failed to fetch all article for the user')
    }
}

export async function listArticlesGlobalByDate() {
    try {
        // TODO: limiting results.
        logger.info('Listing all articles')

        return await listAllArticlesSortedByDate()
    } catch (err) {
        logger.error('Failed to fetch global article:', err)
        throw new Error('Failed to fetch global article')
    }
}
