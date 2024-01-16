/**
 * starting IQR bench
 * avarage time part 1: 0.6897105841801084 ms
 */

export default function solve(input) {
    const map = input.split('\n');

    let last = find_s(map);
    let current = first_dir(last, map);
    if (!last || current < 0) throw new Error('Something happened...');

    const path = [last, current];
    for (;;) {
        const potential_new_curr = next(last, current, map);
        if (potential_new_curr === -1) throw new Error('Something happened...');
        path.push(potential_new_curr);
        if (get_from_map(potential_new_curr, map) === 'S') break;
        last = current;
        current = potential_new_curr;
    }

    return path.length >> 1;
}

function next({ x: x0, y: y0 }, { x: x1, y: y1 }, map) {
    const symbol = get_from_map({ x: x1, y: y1 }, map);
    switch (symbol) {
        case '|': {
            const coming_from_above = y1 > y0;
            if (coming_from_above) {
                return { x: x1, y: y1 + 1 };
            }
            return { x: x1, y: y1 - 1 };
        }
        case '-': {
            const coming_from_left = x1 > x0;
            if (coming_from_left) {
                return { x: x1 + 1, y: y1 };
            }
            return { x: x1 - 1, y: y1 };
        }
        case 'L': {
            const coming_from_above = y1 > y0;
            if (coming_from_above) {
                return { x: x1 + 1, y: y1 };
            }
            return { x: x1, y: y1 - 1 };
        }
        case 'J': {
            const coming_from_above = y1 > y0;
            if (coming_from_above) {
                return { x: x1 - 1, y: y1 };
            }
            return { x: x1, y: y1 - 1 };
        }
        case '7': {
            const coming_from_left = x1 > x0;
            if (coming_from_left) {
                return { x: x1, y: y1 + 1 };
            }
            return { x: x1 - 1, y: y1 };
        }
        case 'F': {
            const coming_from_right = x1 < x0;
            if (coming_from_right) {
                return { x: x1, y: y1 + 1 };
            }
            return { x: x1 + 1, y: y1 };
        }
        case '.':
        default:
            return -1;
    }
}

function get_from_map({ x, y }, map) {
    return map[y][x];
}

function first_dir({ x, y }, map) {
    // down
    if (['|', 'L', 'J'].includes(get_from_map({ x, y: y + 1 }, map))) {
        return { x, y: y + 1 };
    }
    // up
    if (['|', '7', 'F'].includes(get_from_map({ x, y: y - 1 }, map))) {
        return { x, y: y - 1 };
    }
    // right
    if (['-', '7', 'J'].includes(get_from_map({ x: x + 1, y }, map))) {
        return { x: x + 1, y };
    }
    // left
    if (['-', 'F', 'L'].includes(get_from_map({ x: x - 1, y }, map))) {
        return { x: x - 1, y };
    }
    return -1;
}

function find_s(map) {
    for (let y = 0; y < map.length; y++) {
        const line = map[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] === 'S') {
                return { x, y };
            }
        }
    }
}
