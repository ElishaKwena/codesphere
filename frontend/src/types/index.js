/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data
 * @property {number} status
 * @property {string} message
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 */

/**
 * @typedef {Object} PaginatedResponse
 * @template T
 * @property {T} data
 * @property {number} status
 * @property {string} message
 * @property {PaginationParams} pagination
 */

/**
 * @typedef {'light' | 'dark'} Theme
 */

/**
 * @typedef {Object} AppConfig
 * @property {string} apiUrl
 * @property {Theme} theme
 * @property {string} language
 */

export const Theme = {
    LIGHT: 'light',
    DARK: 'dark'
}; 