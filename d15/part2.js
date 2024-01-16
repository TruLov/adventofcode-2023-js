/**
 * starting IQR bench
 * avarage time part 2:
 */

export default function solve(input) {
    const operation_tuples = input
        .split(',')
        .map((entry) => entry.split('='))
        .map((entry) => (entry.length === 1 ? [entry[0].slice(0, 2), entry[0].slice(2)] : entry));
    const operations = input.split(',').map((x) => {
        const [label, focal] = x.split(/[-=]/);
        return focal ? { op: '=', label, focal: +focal } : { op: '-', label };
    });
    const hashmap = new Array(256).fill().map(() => []);
    for (const operation of operations) {
        const box = hash(operation.label);
        const i = hashmap[box].findIndex((x) => x.label === operation.label);
        if (operation.op === '-') {
            if (i !== -1) hashmap[box].splice(i, 1);
        } else {
            if (i === -1) hashmap[box].push(operation);
            else hashmap[box][i] = operation;
        }
    }
    return hashmap
        .flatMap((box, i) => box.map(({ focal }, j) => (i + 1) * (j + 1) * focal))
        .reduce((sum, power) => sum + power, 0);
}

function hash(string) {
    let current_value = 0;
    for (let i = 0; i < string.length; i++) {
        const start = string[i].charCodeAt(0) + current_value;
        current_value = (start * 17) % 256;
    }
    return current_value;
}
