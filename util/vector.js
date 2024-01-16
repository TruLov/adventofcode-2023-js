export function binarySearch(arr, target, compareFn) {
    let lower = 0;
    let upper = arr.length - 1;

    while (lower <= upper) {
        const middle = (lower + upper) >> 1;
        const result = compareFn(target, arr[middle]);

        if (result < 0) {
            lower = middle + 1;
        } else if (result > 0) {
            upper = middle - 1;
        } else if (arr[middle] === target) {
            return middle;
        }
    }

    return -1;
}
