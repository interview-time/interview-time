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

/**
 *
 * @param {string} name
 * @returns {string}
 */
export const getInitials = name => {
    let names = name.split(" ");
    return (names.length > 1 ? names[0].charAt(0) + names[1].charAt(0) : name.charAt(0)).toUpperCase();
};
