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
import { authMiddleware } from '../middlewares.ts/auth'

const router = Router()

// CRUD routes
router.post(
    '/',
    validateRequest(createArticleSchema, 'body'),
    authMiddleware,
    createArticleController
)

// List all articles for a user
router.get(
    '/all/:userId',
    validateRequest(getAllArticleForUserSchema, 'params'),
    authMiddleware,

    listArticlesController
)

router.get(
    '/:userId/:articleId',
    validateRequest(getArticleSchema, 'params'),
    authMiddleware,

    getArticleController
)

router.put(
    '/',
    validateRequest(updateArticleSchema),
    authMiddleware,
    updateArticleController
)

router.delete(
    '/:userId/:articleId',
    validateRequest(getArticleSchema, 'params'),
    authMiddleware,
    deleteArticleController
)

// List all articles sorted by date
router.get('/global', listAllArticlesByDateController)

export default router
