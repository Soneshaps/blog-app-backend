import { Request, Response } from 'express'
import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    listArticles,
    listArticlesGlobalByDate,
} from '../services/article.service'
import { sendResponse } from '../utils/response'

export async function createArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, title, content } = req.body
        const result = await createArticle(userId, title, content)

        sendResponse(res, 201, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function getArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, articleId } = req.params

        const result = await getArticle(userId, articleId)
        if (!result) {
            sendResponse(res, 404, { message: 'Article Not Found' })
        }
        sendResponse(res, 200, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function updateArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { title, content, userId, articleId } = req.body
        const result = await updateArticle(userId, articleId, title, content)

        sendResponse(res, 201, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function deleteArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, articleId } = req.params
        const result = await deleteArticle(userId, articleId)

        sendResponse(res, 200, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function listArticlesController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId } = req.params
        const result = await listArticles(userId)
        sendResponse(res, 200, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}

export async function listAllArticlesByDateController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        // TODO:  pagination
        const result = await listArticlesGlobalByDate()
        sendResponse(res, 200, result)
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, { message: error.message })
    }
}
