/**
 *
 * @param a {[string]}
 * @param b {[string]}
 * @returns {boolean|number}
 */
export const arrayComparator = (a, b) => {
    const arr1 = a ? a : [];
    const arr2 = b ? b : [];
    return arr1.length > 0 && arr2.length > 0 && arr1[0].localeCompare(arr2[0])
}

/**
 *
 * @param a {string}
 * @param b {string}
 * @returns {number}
 */
export const stringComparator = (a, b) => {
    const str1 = a ? a : '';
    const str2 = b ? b : '';
    return str1.localeCompare(str2)
}