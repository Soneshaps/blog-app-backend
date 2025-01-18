import { Request, Response } from 'express'
import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    listArticles,
    listArticlesGlobalByDate,
} from '../services/article.service'

export async function createArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, title, content } = req.body
        const newItem = await createArticle(userId, title, content)
        return res.status(201).json(newItem)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function getArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, articleId } = req.params
        const item = await getArticle(userId, articleId)
        if (!item) {
            return res.status(404).json({ error: 'Article not found.' })
        }
        return res.status(200).json(item)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function updateArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, articleId } = req.params
        const { title, content } = req.body
        const updatedItem = await updateArticle(
            userId,
            articleId,
            title,
            content
        )
        return res.status(200).json(updatedItem)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function deleteArticleController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId, articleId } = req.params
        await deleteArticle(userId, articleId)
        return res.status(204).send()
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function listArticlesController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        const { userId } = req.params
        const articles = await listArticles(userId)
        return res.status(200).json(articles)
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

export async function listAllArticlesByDateController(
    req: Request,
    res: Response
): Promise<any> {
    try {
        // Possibly read query params or handle pagination
        const articles = await listArticlesGlobalByDate()
        return res.status(200).json(articles)
    } catch (error: any) {
        return res.status(500).json({
            error: error.message || 'Failed to list articles globally by date.',
        })
    }
}
