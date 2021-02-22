/**
 *
 * @param a {[string]}
 * @param b {[string]}
 * @returns {boolean|number}
 */
import { Difficulty } from "./constants";

export const localeCompareArray = (a, b) => {
    const arr1 = a ? a : [];
    const arr2 = b ? b : [];
    return arr1.length > 0 && arr2.length > 0 && arr1[0].localeCompare(arr2[0])
}

/**
 *
 * @param a {string}
 * @param b {string}
 * @param ignoreCase {boolean}
 * @returns {number}
 */
export const localeCompare = (a, b, ignoreCase= false) => {
    const str1 = a ? a : '';
    const str2 = b ? b : '';
    if (ignoreCase) {
        return str1.toLocaleLowerCase().localeCompare(str2.toLocaleLowerCase())
    } else {
        return str1.localeCompare(str2)
    }
}

/**
 *
 * @param a {string}
 * @param b {string}
 * @returns {number}
 */
export const localeCompareDifficult = (a, b) => {
    const str1 = a ? a : '';
    const str2 = b ? b : '';

    if(str1 === str2) return 0;

    if(str1 === Difficulty.EASY) return -1

    if(str2 === Difficulty.EASY) return 1;

    if(str1 === Difficulty.MEDIUM) return -1

    if(str2 === Difficulty.MEDIUM) return 1;

    if(str1 === Difficulty.HARD) return -1

    if(str2 === Difficulty.HARD) return 1
}

/**
 *
 * @param a {string}
 * @param b {string}
 * @param ignoreCase {boolean}
 * @returns {boolean}
 */
export const includes = (a, b, ignoreCase= false) => {
    const str1 = a ? a : '';
    const str2 = b ? b : '';
    if (ignoreCase) {
        return str1.toLocaleLowerCase().includes(str2.toLocaleLowerCase())
    } else {
        return str1.includes(str2)
    }
}