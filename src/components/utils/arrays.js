/**
 * Swaps two elements in the array
 * @param {any[]} arr
 * @param {number} index1
 * @param {number} index2
 */
export const swap = (arr, index1, index2) => {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
};
