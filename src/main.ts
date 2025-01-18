import { startServer } from '.'
import logger from './utils/logger'
;(async () => {
    try {
        await startServer()
    } catch (err) {
        logger.error('Error:', err)
        process.exit(1)
    }
})()
