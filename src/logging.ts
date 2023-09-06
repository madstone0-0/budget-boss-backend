import winston from "winston";
import morgan from "morgan";

const {
    combine,
    timestamp,
    printf,
    json,
    colorize,
    align,
    splat,
    errors,
    prettyPrint,
} = winston.format;

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        prettyPrint(),
        json(),
        errors({ stack: true }),
        timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        colorize(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
    rejectionHandlers: [new winston.transports.Console()],
});

const httpLogger = morgan("short", {
    stream: { write: (message) => logger.info(message.trim()) },
});

export { logger, httpLogger };
