/**
 *
 * @param {string} string
 * @returns {number} - hash of a string
 */
export const hashCode = string => {
    for (var i = 0, h = 0; i < string.length; i++) {
        h = (Math.imul(31, h) + string.charCodeAt(i)) | 0;
    }
    return h;
};
