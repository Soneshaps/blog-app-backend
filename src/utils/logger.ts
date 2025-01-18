import { createLogger, format, transports } from 'winston'

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const customFormat = format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString =
        Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`
})

const logger = createLogger({
    levels,
    level: 'info',
    format: format.combine(format.timestamp(), customFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
})

export default logger
