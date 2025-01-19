import { Request, Response, NextFunction } from 'express'
import { AnyObjectSchema } from 'yup'

type ValidateSource = 'body' | 'query' | 'params'

/**
 * Generic function to validate a particular part of the request
 * e.g., body, query, or params with a Yup schema.
 */
export function validateRequest(
    schema: AnyObjectSchema,
    source: ValidateSource = 'body'
) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dataToValidate = req[source]

            const validated = await schema.validate(dataToValidate, {
                abortEarly: false,
            })

            req[source] = validated

            next()
        } catch (err: any) {
            const validationErrors: string[] = []

            if (err.inner) {
                err.inner.forEach((e: any) => {
                    validationErrors.push(e.message)
                })
            } else {
                validationErrors.push(err.message)
            }

            res.status(400).json({ errors: validationErrors })
        }
    }
}
