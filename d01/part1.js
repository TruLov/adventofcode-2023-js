export default function solve(input) {
    const lines = input.trim().split('\n');

    const sum = lines
        .map((line) => {
            const numbers = line.match(/\d/g);
            return parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`);
        })
        .reduce((a, b) => a + b, 0);

    return sum;
}
