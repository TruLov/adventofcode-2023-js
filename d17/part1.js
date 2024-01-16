/**
 * starting IQR bench
 * avarage time part 1: 2.846s
 */

import { PriorityQueue } from '@datastructures-js/priority-queue';

const DIRS = { '>': [1, 0], '<': [-1, 0], '^': [0, -1], v: [0, 1] };

export default function solve(input) {
    const grid = input.split('\n').map((line) => line.split('').map(Number));

    const max_x = grid[0].length - 1;
    const max_y = grid.length - 1;

    const frontier = new PriorityQueue(
        (a, b) => a.x + a.y - (b.x + b.y) || a.total - b.total,
        [
            { x: 0, y: 0, total: 0, path: '>' },
            { x: 0, y: 0, total: 0, path: 'v' },
        ]
    );

    const explored = new Map(frontier.toArray().map((n) => [key(n), n]));

    let min = Infinity;
    while (frontier.size() > 0) {
        const current = frontier.dequeue();
        if (current.x === max_x && current.y === max_y) {
            min = Math.min(min, current.total);
            continue;
        }
        if (current.total >= min) continue;
        const next = next_coords(current, grid, 3).filter(
            (n) => !explored.has(key(n)) || explored.get(key(n)).total > n.total
        );
        next.forEach((n) => {
            explored.set(key(n), n);
            frontier.enqueue(n);
        });
    }
    return min;
}

function next_coords(current, grid, max_steps) {
    const next = [];
    const { x, y, total, path } = current;

    const s = count_same_chars_from_right(path, max_steps);
    const d = path.slice(-1);

    if (s < max_steps) {
        next.push({ x: x + DIRS[d][0], y: y + DIRS[d][1], path: `${path}${d}`, total });
    }
    if (d === '>' || d === '<') {
        next.push({ x, y: y - 1, path: `${path}^`, total });
        next.push({ x, y: y + 1, path: `${path}v`, total });
    }
    if (d === '^' || d === 'v') {
        next.push({ x: x - 1, y, path: `${path}<`, total });
        next.push({ x: x + 1, y, path: `${path}>`, total });
    }
    return next
        .filter(({ x, y }) => grid[y]?.[x])
        .map((n) => ({ ...n, total: n.total + grid[n.y][n.x] }));
}

function key({ x, y, path }) {
    return `${x},${y},${path.slice(-3)}`;
}

function count_same_chars_from_right(str, max) {
    const d = str.slice(-1);
    let c = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] !== d || --max < 0) return c;
        c++;
    }
    return c;
}
