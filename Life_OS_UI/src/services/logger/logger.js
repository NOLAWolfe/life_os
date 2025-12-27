/**
 * Structured Logging Service
 * Provides consistent logging across the application.
 * Can be easily extended to send logs to external services (Sentry, LogRocket, etc.)
 */

const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

const formatMessage = (level, message, context = {}) => {
    const timestamp = new Date().toISOString();
    return {
        timestamp,
        level,
        message,
        context,
        app: 'Life_OS_UI',
    };
};

const LOG_LIMIT = 50;

const saveLog = (log) => {
    try {
        const history = JSON.parse(localStorage.getItem('life_os_logs') || '[]');
        history.unshift(log);
        localStorage.setItem('life_os_logs', JSON.stringify(history.slice(0, LOG_LIMIT)));
    } catch {
        // Silent fail for storage issues
    }
};

const logger = {
    info: (message, context) => {
        const log = formatMessage(LOG_LEVELS.INFO, message, context);
        console.log(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
        saveLog(log);
    },

    warn: (message, context) => {
        const log = formatMessage(LOG_LEVELS.WARN, message, context);
        console.warn(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
        saveLog(log);
    },

    error: (message, context, error) => {
        const log = formatMessage(LOG_LEVELS.ERROR, message, {
            ...context,
            error: error?.message,
            stack: error?.stack,
        });
        console.error(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
        saveLog(log);
    },

    debug: (message, context) => {
        if (import.meta.env.DEV) {
            const log = formatMessage(LOG_LEVELS.DEBUG, message, context);
            console.debug(`[${log.timestamp}] [${log.level}] ${log.message}`, log.context);
            saveLog(log);
        }
    },

    getHistory: () => {
        return JSON.parse(localStorage.getItem('life_os_logs') || '[]');
    },

    clearHistory: () => {
        localStorage.removeItem('life_os_logs');
    },
};

export default logger;
