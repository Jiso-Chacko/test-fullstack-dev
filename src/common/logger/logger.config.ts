import * as winston from "winston";
import * as path from "path"

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, context, stack }) => {
        const ctx = context ? `[${context}]` : ''
        return `${timestamp} ${level} ${ctx} ${message} ${stack}`
    })
)

const logsDir = path.join(process.cwd(), "logs");

export const winstonConfig = {
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: "error",
            maxsize: 1024 * 1024, // 1MB
        })
    ]
}