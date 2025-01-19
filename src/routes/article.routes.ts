import { Router } from 'express'
import {
    createArticleController,
    getArticleController,
    updateArticleController,
    deleteArticleController,
    listArticlesController,
    listAllArticlesByDateController,
} from '../controllers/article.controller'
import { validateRequest } from '../middlewares.ts/validateRequest'
import {
    createArticleSchema,
    getAllArticleForUserSchema,
    getArticleSchema,
    updateArticleSchema,
} from '../validators/article.validators'

const router = Router()

// CRUD routes
router.post(
    '/',
    validateRequest(createArticleSchema, 'body'),
    createArticleController
)

// List all articles for a user
router.get(
    '/all/:userId',
    validateRequest(getAllArticleForUserSchema, 'params'),
    listArticlesController
)

router.get(
    '/:userId/:articleId',
    validateRequest(getArticleSchema, 'params'),
    getArticleController
)

router.put('/', validateRequest(updateArticleSchema), updateArticleController)

router.delete(
    '/:userId/:articleId',
    validateRequest(getArticleSchema, 'params'),
    deleteArticleController
)

// List all articles sorted by date
router.get('/global', listAllArticlesByDateController)

export default router
