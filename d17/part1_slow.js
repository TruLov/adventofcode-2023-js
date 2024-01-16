/**
 * starting IQR bench
 * avarage time part 1: 8.518s
 */

export default function solve(input) {
    const grid = input.split('\n').map((line) => line.split('').map(Number));

    const max_x = grid[0].length - 1;
    const max_y = grid.length - 1;

    const frontier = [
        {
            x: 0,
            y: 0,
            total: 0,
            estimate: heuristic({ x: 0, y: 0 }, max_x, max_y),
            path: '>',
        },
        {
            x: 0,
            y: 0,
            total: 0,
            estimate: heuristic({ x: 0, y: 0 }, max_x, max_y),
            path: 'v',
        },
    ];

    const visited = new Map(frontier.map((n) => [key(n), n]));

    let min = Infinity;
    while (frontier.length > 0) {
        const current = frontier.shift();
        if (current.x === grid[0].length - 1 && current.y === grid.length - 1) {
            min = Math.min(min, current.total);
            continue;
        }
        if (current.total >= min) continue;
        const next = next_coords(current, grid, 3).filter(
            (n) => !visited.has(key(n)) || visited.get(key(n)).total > n.total
        );
        next.forEach((n) => {
            visited.set(key(n), n);
            insert_sorted(frontier, {
                x: n.x,
                y: n.y,
                path: n.path,
                total: n.total,
                estimate: n.total + heuristic({ x: n.x, y: n.y }, max_x, max_y),
            });
        });
    }
    return min;
}

function next_coords(current, grid, maxSteps) {
    const next = [];
    const { x, y, total, path } = current;

    const s = count_same_chars_from_right(path, maxSteps);
    const d = path.slice(-1);

    if (s < maxSteps) {
        if (d === '>') next.push({ x: x + 1, y, path: `${path}>`, total });
        if (d === '<') next.push({ x: x - 1, y, path: `${path}<`, total });
        if (d === '^') next.push({ x, y: y - 1, path: `${path}^`, total });
        if (d === 'v') next.push({ x, y: y + 1, path: `${path}v`, total });
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
