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

/**
 * Create a new Article
 */
export async function createArticle(
    userId: string,
    title: string,
    content: string
) {
    if (!userId || !title || !content) {
        logger.info('Missing Required field to create a new article')
        throw new Error('Missing required fields.')
    }

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
}

/**
 * Get a single article
 */
export async function getArticle(userId: string, articleId: string) {
    if (!userId || !articleId) {
        logger.error('Missing Required field to create a new article')
    }
    logger.info('Fetching a article for id: ', articleId)

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
        logger.error('Missing Required field to update the article')
        throw new Error('Missing required fields.')
    }

    logger.info('Updating a article for id: ', articleId)
    return await updateArticleItem(userId, articleId, { title, content })
}

/**
 * Delete an article
 */
export async function deleteArticle(userId: string, articleId: string) {
    if (!userId || !articleId) {
        logger.error('Missing Required field to delete the article')
        throw new Error('Missing userId or articleId.')
    }
    logger.info('Deleting a article for id: ', articleId)

    await deleteArticleItem(userId, articleId)
}

/**
 * List all articles for a user
 */
export async function listArticles(userId: string) {
    if (!userId) {
        logger.error('Missing Required field to fetch the articles')

        throw new Error('Missing userId.')
    }
    logger.info('Listing a article for userId: ', userId)

    return await listArticlesByUser(userId)
}

export async function listArticlesGlobalByDate() {
    // TODO: limiting results.
    logger.info('Listing all articles')

    return await listAllArticlesSortedByDate()
}
