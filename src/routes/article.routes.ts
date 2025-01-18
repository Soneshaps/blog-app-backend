import { Router } from 'express'
import {
    createArticleController,
    getArticleController,
    updateArticleController,
    deleteArticleController,
    listArticlesController,
    listAllArticlesByDateController,
} from '../controllers/article.controller'

const router = Router()

// CRUD routes
router.post('/', createArticleController)
router.get('/:userId/:articleId', getArticleController)
router.put('/:userId/:articleId', updateArticleController)
router.delete('/:userId/:articleId', deleteArticleController)

// New route for listing all articles sorted by date
router.get('/all', listAllArticlesByDateController)

// Optional route to list all articles for a user
router.get('/:userId', listArticlesController)

export default router
