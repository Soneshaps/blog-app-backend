import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
    username: yup.string().required('username is required'),
    email: yup.string().required('email is required'),
    password: yup.string().required('password is required'),
})

export const loginUserSchema = yup.object().shape({
    email: yup.string().required('email is required'),
    password: yup.string().required('password is required'),
})
