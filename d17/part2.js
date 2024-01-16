/**
 * starting IQR bench
 * avarage time part 2:
 */

import { PriorityQueue } from '@datastructures-js/priority-queue';

const DIRS = { '>': [1, 0], '<': [-1, 0], '^': [0, -1], v: [0, 1] };

export default function solve(input) {
    const map = input.split('\n').map((line) => line.split('').map(Number));
    const key = ({ x, y, d, s }) => `${x},${y},${d},${s}`;
    const compare = (a, b) => a.x + a.y - (b.x + b.y) || a.total - b.total;
    const queue = new PriorityQueue(compare, [
        { x: 0, y: 0, total: 0, d: 'right', s: 0 },
        { x: 0, y: 0, total: 0, d: 'down', s: 0 },
    ]);
    const visited = new Map(queue.toArray().map((n) => [key(n), n]));
    let min = Infinity;
    while (queue.size() > 0) {
        const current = queue.dequeue();
        if (current.x === map[0].length - 1 && current.y === map.length - 1) {
            min = Math.min(min, current.total);
            continue;
        }
        if (current.total >= min) continue;
        const next = getNext(current, map, 4, 10).filter(
            (n) => !visited.has(key(n)) || visited.get(key(n)).total > n.total
        );
        next.forEach((n) => {
            visited.set(key(n), n);
            queue.enqueue(n);
        });
    }
    return min;
}

function next_coords(current, grid, min_steps, max_steps) {
    const next = [];
    const { x, y, total, path } = current;

    const s = count_same_chars_from_right(path, max_steps);
    const d = path.slice(-1);

    if (s < max_steps) {
        next.push({ x: x + DIRS[d][0], y: y + DIRS[d][1], path: `${path}${d}`, total });
    }

    if (s < min_steps) {
        const go_min_steps = next.map((n) => {
            const ns = count_same_chars_from_right(n.path, max_steps);
            // const nd = n.path.slice(-1);
            if (ns >= min_steps) {
                return n;
            }
            const jumped = jump(grid, n, min_steps, max_steps);
            return jumped;

            // const diff = min_steps - ns;
            // const costs = [...Array(diff).keys()].map((i) => {
            //     return grid[n.y + DIRS[nd][1] * i]?.[n.x + DIRS[nd][0] * i];
            // });
            // n.total += costs.reduce((a, b) => a + b, 0);
            // n.path += Array(diff).join(nd);
            // n.x += diff * DIRS[nd][0];
            // n.y += diff * DIRS[nd][1];

            // return n;
        });
        return go_min_steps
            .filter(({ x, y }) => grid[y]?.[x])
            .map((n) => ({ ...n, total: n.total + grid[n.y][n.x] }));
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

function jump(map, { x, y, total, d, s }, minSteps) {
    for (; s < minSteps; s++) {
        total += map[y]?.[x] || 0;
        if (d === 'right') x++;
        if (d === 'left') x--;
        if (d === 'up') y--;
        if (d === 'down') y++;
    }
    return { x, y, total, d, s };
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

// Manhattan distance
function heuristic({ x, y }, max_x, max_y) {
    const dx = Math.abs(x - max_x);
    const dy = Math.abs(y - max_y);
    const estimate = dx + dy;
    return Math.ceil(estimate);
}

function insert_sorted(list, element) {
    if (!list || list.length === 0) {
        list.splice(0, 0, element);
        return;
    }

    for (let i = 0, list_len = list.length; i < list_len; i++) {
        if (element.estimate > list[i].estimate) {
            continue;
        }
        list.splice(i, 0, element);
        return;
    }

    list.push(element);
}

function getNext(current, map, minSteps, maxSteps) {
    const next = [];
    const { x, y, total, d, s } = current;
    if (s < maxSteps) {
        if (d === 'right') next.push({ x: x + 1, y, d: 'right', s: s + 1, total });
        if (d === 'left') next.push({ x: x - 1, y, d: 'left', s: s + 1, total });
        if (d === 'up') next.push({ x, y: y - 1, d: 'up', s: s + 1, total });
        if (d === 'down') next.push({ x, y: y + 1, d: 'down', s: s + 1, total });
    }
    if (s >= minSteps && (d === 'right' || d === 'left')) {
        next.push({ x, y: y - 1, d: 'up', s: 1, total });
        next.push({ x, y: y + 1, d: 'down', s: 1, total });
    }
    if (s >= minSteps && (d === 'up' || d === 'down')) {
        next.push({ x: x - 1, y, d: 'left', s: 1, total });
        next.push({ x: x + 1, y, d: 'right', s: 1, total });
    }
    return next
        .map((n) => (n.s < minSteps ? jump(map, n, minSteps) : n))
        .filter(({ x, y }) => map[y]?.[x] !== undefined)
        .map((n) => ({ ...n, total: n.total + map[n.y][n.x] }));
}
