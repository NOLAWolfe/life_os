/**
 * Structured Logging Service
 * Provides consistent logging across the application.
 * Can be easily extended to send logs to external services (Sentry, LogRocket, etc.)
 */

const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG'
};

const formatMessage = (level, message, context = {}) => {
    const timestamp = new Date().toISOString();
    return {
        timestamp,
        level,
        message,
        context,
        app: 'Life_OS_UI'
    };
};

const logger = {
    info: (message, context) => {
        const log = formatMessage(LOG_LEVELS.INFO, message, context);
        console.log(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
    },
    
    warn: (message, context) => {
        const log = formatMessage(LOG_LEVELS.WARN, message, context);
        console.warn(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
    },
    
    error: (message, context, error) => {
        const log = formatMessage(LOG_LEVELS.ERROR, message, { ...context, error: error?.message, stack: error?.stack });
        console.error(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
    },
    
    debug: (message, context) => {
        if (import.meta.env.DEV) {
            const log = formatMessage(LOG_LEVELS.DEBUG, message, context);
            console.debug(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
        }
    }
};

export default logger;
