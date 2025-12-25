/**
 * Security Service
 * Handles PII (Personally Identifiable Information) obfuscation.
 * Ensures raw account numbers and real names are masked in the UI and Logs.
 */

const USER_NAME = import.meta.env.VITE_USER_NAME || 'User';
const USER_NAME_ALT = import.meta.env.VITE_USER_NAME_ALT || 'User Alt';

const securityService = {
    /**
     * Masks account numbers in strings.
     * "Chase Checking - xxxx1234" -> "Chase Checking ••••1234"
     * "Account # 123456789" -> "Account # •••••6789"
     */
    maskAccount: (str) => {
        if (!str) return '';
        // Look for sequences of 4+ digits
        return str.replace(/\b\d{4,}\b/g, (match) => {
            const visible = match.slice(-4);
            return '••••' + visible;
        });
    },

    /**
     * Replaces real names with a generic placeholder.
     */
    maskName: (str) => {
        if (!str) return '';
        let masked = str;

        if (USER_NAME && USER_NAME.length > 2) {
            const regex = new RegExp(USER_NAME, 'gi');
            masked = masked.replace(regex, 'User');
        }

        if (USER_NAME_ALT && USER_NAME_ALT.length > 2) {
            const regexAlt = new RegExp(USER_NAME_ALT, 'gi');
            masked = masked.replace(regexAlt, 'User');
        }

        return masked;
    },

    /**
     * Standard sanitization pipeline for any financial string.
     */
    sanitize: (str) => {
        return securityService.maskName(securityService.maskAccount(str));
    },
};

export default securityService;
