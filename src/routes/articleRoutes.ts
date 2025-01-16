import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('Get all articles')
})

router.post('/', (req, res) => {
    res.send('Create an article')
})

router.put('/:id', (req, res) => {
    res.send(`Update article with ID ${req.params.id}`)
})

router.delete('/:id', (req, res) => {
    res.send(`Delete article with ID ${req.params.id}`)
})

export default router
