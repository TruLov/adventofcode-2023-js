/**
 * starting IQR bench
 * avarage time part 2:
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

    const max_x = map[0].length - 1;
    const max_y = map.length - 1;

    let max = 0;
    for (let x = 0; x <= max_x; x++) {
        const d = solve_part1([x, 0, 'd'], map, max_x, max_y);
        const u = solve_part1([x, max_y, 'u'], map, max_x, max_y);
        max = Math.max(max, d, u);
    }
    for (let y = 0; y <= max_y; y++) {
        const r = solve_part1([0, y, 'r'], map, max_x, max_y);
        const l = solve_part1([max_x, y, 'l'], map, max_x, max_y);
        max = Math.max(max, r, l);
    }

    return max;
}

function solve_part1(start, map, max_x, max_y) {
    const beam_map = Array.from({ length: map.length }, () => Array(map.length));

    const queue = [start];
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
