import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    listArticles,
    listArticlesGlobalByDate,
} from '../article.service'
import {
    createArticleItem,
    getArticleItem,
    updateArticleItem,
    deleteArticleItem,
    listArticlesByUser,
    listAllArticlesSortedByDate,
} from '../../models/article.model'
import { redisClient } from '../../utils/redisClient'
import { v4 as uuidv4 } from 'uuid'

// Mock the dependencies
jest.mock('../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}))

jest.mock('../../models/article.model', () => ({
    createArticleItem: jest.fn(),
    getArticleItem: jest.fn(),
    updateArticleItem: jest.fn(),
    deleteArticleItem: jest.fn(),
    listArticlesByUser: jest.fn(),
    listAllArticlesSortedByDate: jest.fn(),
}))

jest.mock('../../utils/redisClient', () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
}))

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mocked-uuid'),
}))

describe('Article Service', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createArticle', () => {
        it('should create a new article if all fields are provided', async () => {
            // Arrange
            const mockUserId = 'user-123'
            const mockTitle = 'Test Title'
            const mockContent = 'Test Content'
            ;(createArticleItem as jest.Mock).mockResolvedValue({
                PK: `USER#${mockUserId}`,
                SK: `ARTICLE#mocked-uuid`,
                title: mockTitle,
                content: mockContent,
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z',
            })

            // Act
            const result = await createArticle(
                mockUserId,
                mockTitle,
                mockContent
            )

            // Assert
            expect(uuidv4).toHaveBeenCalled()
            expect(createArticleItem).toHaveBeenCalledWith(
                mockUserId,
                'mocked-uuid',
                {
                    title: mockTitle,
                    content: mockContent,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }
            )
            expect(result).toHaveProperty('PK', `USER#${mockUserId}`)
            expect(result).toHaveProperty('SK', 'ARTICLE#mocked-uuid')
        })

        it('should throw a 400 error if missing fields', async () => {
            await expect(createArticle('', 'title', 'content')).rejects.toThrow(
                'Missing required fields.'
            )
        })

        it('should throw a 500 error if model fails unexpectedly', async () => {
            ;(createArticleItem as jest.Mock).mockRejectedValue(
                new Error('DB error')
            )

            await expect(
                createArticle('user-123', 'title', 'content')
            ).rejects.toThrow('Failed to Create a new article')
        })
    })

    describe('getArticle', () => {
        const mockUserId = 'user-123'
        const mockArticleId = 'article-456'
        const mockCacheKey = `article:${mockArticleId}`

        it('should fetch from cache if available', async () => {
            // Arrange
            const cachedData = JSON.stringify({ PK: 'cached-data' })
            ;(redisClient.get as jest.Mock).mockResolvedValue(cachedData)

            // Act
            const result = await getArticle(mockUserId, mockArticleId)

            // Assert
            expect(redisClient.get).toHaveBeenCalledWith(mockCacheKey)
            expect(getArticleItem).not.toHaveBeenCalled()
            expect(result).toEqual({ PK: 'cached-data' })
        })

        it('should fetch from DB if cache is empty, then store in cache', async () => {
            // Arrange
            ;(redisClient.get as jest.Mock).mockResolvedValue(null)
            ;(getArticleItem as jest.Mock).mockResolvedValue({
                PK: `USER#${mockUserId}`,
                SK: `ARTICLE#${mockArticleId}`,
            })

            // Act
            const result = await getArticle(mockUserId, mockArticleId)

            // Assert
            expect(redisClient.get).toHaveBeenCalledWith(mockCacheKey)
            expect(getArticleItem).toHaveBeenCalledWith(
                mockUserId,
                mockArticleId
            )
            expect(redisClient.set).toHaveBeenCalledWith(
                mockCacheKey,
                JSON.stringify({
                    PK: `USER#${mockUserId}`,
                    SK: `ARTICLE#${mockArticleId}`,
                }),
                { EX: 3600 }
            )
            expect(result).toEqual({
                PK: `USER#${mockUserId}`,
                SK: `ARTICLE#${mockArticleId}`,
            })
        })

        it('should throw 400 if missing userId or articleId', async () => {
            await expect(getArticle('', 'abc')).rejects.toThrow(
                'Missing Required field to create a new article.'
            )
        })

        it('should throw 500 on unexpected error', async () => {
            ;(redisClient.get as jest.Mock).mockRejectedValue(
                new Error('Redis error')
            )

            await expect(getArticle(mockUserId, mockArticleId)).rejects.toThrow(
                'Failed to fetch article for user'
            )
        })
    })

    describe('updateArticle', () => {
        it('should update an article and remove from cache', async () => {
            // Arrange
            const mockUserId = 'user-123'
            const mockArticleId = 'article-456'

            ;(updateArticleItem as jest.Mock).mockResolvedValue({
                updated: true,
            })
            ;(redisClient.del as jest.Mock).mockResolvedValue(1)

            // Act
            const result = await updateArticle(
                mockUserId,
                mockArticleId,
                'New Title',
                'New Content'
            )

            // Assert
            expect(updateArticleItem).toHaveBeenCalledWith(
                mockUserId,
                mockArticleId,
                {
                    title: 'New Title',
                    content: 'New Content',
                }
            )
            expect(redisClient.del).toHaveBeenCalledWith(
                `article:${mockArticleId}`
            )
            expect(result).toEqual({ updated: true })
        })

        it('should throw 400 if missing fields', async () => {
            await expect(
                updateArticle('user-123', 'article-456', '', 'New Content')
            ).rejects.toThrow('Missing required fields.')
        })

        it('should throw 500 on unexpected error', async () => {
            ;(updateArticleItem as jest.Mock).mockRejectedValue(
                new Error('DB fail')
            )
            await expect(
                updateArticle('user-123', 'article-456', 'title', 'content')
            ).rejects.toThrow('Failed to update the article')
        })
    })

    describe('deleteArticle', () => {
        it('should delete an article and remove from cache', async () => {
            // Arrange

            ;(deleteArticleItem as jest.Mock).mockResolvedValue(true)
            ;(redisClient.del as jest.Mock).mockResolvedValue(1)

            // Act
            const result = await deleteArticle('user-123', 'article-456')

            // Assert
            expect(deleteArticleItem).toHaveBeenCalledWith(
                'user-123',
                'article-456'
            )
            expect(redisClient.del).toHaveBeenCalledWith('article:article-456')
            expect(result).toEqual({ message: 'Article Deleted Successfully' })
        })

        it('should throw 400 if missing userId or articleId', async () => {
            await expect(deleteArticle('', 'article-456')).rejects.toThrow(
                'Missing userId or articleId.'
            )
        })

        it('should throw 500 on unexpected error', async () => {
            ;(deleteArticleItem as jest.Mock).mockRejectedValue(
                new Error('DB fail')
            )

            await expect(deleteArticle('user', 'article')).rejects.toThrow(
                'Failed to delete the article'
            )
        })
    })

    describe('listArticles', () => {
        it('should list articles for a user', async () => {
            ;(listArticlesByUser as jest.Mock).mockResolvedValue([
                { SK: 'ARTICLE#1' },
                { SK: 'ARTICLE#2' },
            ])

            const result = await listArticles('user-123')
            expect(listArticlesByUser).toHaveBeenCalledWith('user-123')
            expect(result).toHaveLength(2)
        })

        it('should throw 400 if missing userId', async () => {
            await expect(listArticles('')).rejects.toThrow('Missing userId.')
        })

        it('should throw 500 on unexpected error', async () => {
            ;(listArticlesByUser as jest.Mock).mockRejectedValue(
                new Error('Fail')
            )

            await expect(listArticles('user-123')).rejects.toThrow(
                'Failed to fetch all article for the user'
            )
        })
    })

    describe('listArticlesGlobalByDate', () => {
        it('should list all articles globally by date', async () => {
            ;(listAllArticlesSortedByDate as jest.Mock).mockResolvedValue([
                { SK: 'ARTICLE#3' },
            ])

            const result = await listArticlesGlobalByDate()
            expect(listAllArticlesSortedByDate).toHaveBeenCalled()
            expect(result).toEqual([{ SK: 'ARTICLE#3' }])
        })

        it('should throw 500 on unexpected error', async () => {
            ;(listAllArticlesSortedByDate as jest.Mock).mockRejectedValue(
                new Error('Fail')
            )

            await expect(listArticlesGlobalByDate()).rejects.toThrow(
                'Failed to fetch global article'
            )
        })
    })
})
