/**
 * starting IQR bench
 * avarage time part 1: 4.53331883057304 ms
 */

const R = [1, 0, 'r'];
const L = [-1, 0, 'l'];
const U = [0, -1, 'u'];
const D = [0, +1, 'd'];

const DIRECTIONS = {
    '.': { r: [R], l: [L], u: [U], d: [D] },
    '|': { r: [U, D], l: [U, D], u: [U], d: [D] },
    '-': { r: [R], l: [L], u: [L, R], d: [L, R] },
    '/': { r: [U], l: [D], u: [R], d: [L] },
    '\\': { r: [D], l: [U], u: [L], d: [R] },
};

export default function solve(input) {
    const map = input.split('\n').map((line) => line.split(''));
    const beam_map = Array.from({ length: map.length }, () => Array(map.length));

    const max_x = map[0].length - 1;
    const max_y = map.length - 1;

    const queue = [[0, 0, 'r']];
    while (queue.length > 0) {
        const [x, y, d] = queue.shift();
        const next = DIRECTIONS[map[y][x]][d]
            .map((a) => [x + a[0], y + a[1], a[2]])
            .filter(
                ([x, y, d]) =>
                    x >= 0 && y >= 0 && x <= max_x && y <= max_y && !beam_map[y]?.[x]?.includes(d)
            );

        beam_map[y][x] = [d, ...(beam_map[y][x] || [])];
        queue.push(...next);
    }

    return beam_map.flatMap((line) => line.filter((cell) => cell.length > 0)).length;
}
