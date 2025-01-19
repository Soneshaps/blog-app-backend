import * as yup from 'yup'

export const createArticleSchema = yup.object().shape({
    userId: yup.string().required('userId is required'),
    title: yup.string().required('title is required'),
    content: yup.string().required('content is required'),
})

export const updateArticleSchema = yup.object().shape({
    userId: yup.string().required('userId is required'),
    title: yup.string().required('title is required'),
    content: yup.string().required('content is required'),
})

export const getArticleSchema = yup.object().shape({
    userId: yup.string().required('userId is required'),
    articleId: yup.string().required('title is required'),
})

export const getAllArticleForUserSchema = yup.object().shape({
    userId: yup.string().required('userId is required'),
})
