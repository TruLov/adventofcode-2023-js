/**
 * starting IQR bench
 * avarage time part 1:
 */

export default function solve(input) {
    const sum = input
        .split(',')
        .map((val) => hash(val))
        .reduce((a, b) => a + b, 0);
    return sum;
}

function hash(string) {
    let current_value = 0;
    for (let i = 0; i < string.length; i++) {
        const start = string[i].charCodeAt(0) + current_value;
        current_value = (start * 17) % 256;
    }
    return current_value;
}
