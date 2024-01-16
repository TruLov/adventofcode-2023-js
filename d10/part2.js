/**
 * starting IQR bench
 * avarage time part 2: 4.607053188567466 ms
 */

export default function solve(input) {
    const map = input.split('\n').map((line) => line.split(''));

    // find start
    const start_pos = first_occurence_of('S', map);

    // replace S with symbol for the directions S is pointing
    const start_connections = detect_connections(start_pos, map);
    map[start_pos.y][start_pos.x] = start_connections[0];

    // walk path and mark path in a copied map
    const { path, path_map } = walk_path(start_pos, map);

    // calculate path boundaries in map
    const { y0, yn, x0, xn } = calculate_path_window(path, map);

    let inside_count = 0;
    for (let y = y0; y <= yn; y++) {
        for (let x = x0; x <= xn; x++) {
            if (path_map[y][x] === 'X') continue;

            let x1 = x;
            let y1 = y;
            let intersections = 0;

            // draw line to [down-left] and count intersections
            while (++y1 <= yn && ++x1 <= xn) {
                if (path_map[y1][x1] === 'X') {
                    const point = map[y1][x1];
                    if (point !== 'L' && point !== '7') ++intersections;
                }
            }
            if (intersections % 2 === 1) ++inside_count;
        }
    }
    return inside_count;
}

function walk_path(start, map) {
    const path_map = [...map.map((x) => [...x])];

    let last = start;
    let current = start;
    const path = [current];
    for (;;) {
        const next_position = next(last, current, map);
        path.push(next_position);
        path_map[current.y][current.x] = 'X';
        if (next_position.y === start.y && next_position.x === start.x) break;

        last = current;
        current = next_position;
    }
    return { path, path_map };
}

function next({ x: x0, y: y0 }, { x: x1, y: y1 }, map) {
    const symbol = map[y1][x1];
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

function calculate_path_window(path, map) {
    let x0 = map[0].length - 1;
    let y0 = map.length - 1;
    let xn = 0;
    let yn = 0;

    for (let i = 0; i < path.length; i++) {
        const { x, y } = path[i];
        if (x < x0) x0 = x;
        if (x > xn) xn = x;
        if (y < y0) y0 = y;
        if (y > yn) yn = y;
    }

    return { y0, yn, x0, xn };
}

function detect_connections({ x, y }, map) {
    const connections = [];

    const down_open = ['|', '7', 'F'];
    const up_open = ['|', 'L', 'J'];
    const left_open = ['-', '7', 'J'];
    const right_open = ['-', 'F', 'L'];

    // check lower point
    if (y < map.length + 1 && up_open.includes(map[y + 1][x])) {
        connections.push(...down_open);
    }

    // check upper point
    if (y > 0 && down_open.includes(map[x][y - 1])) {
        connections.push(...up_open);
    }

    // check right point
    if (x < map[0].length + 1 && left_open.includes(map[x + 1][y])) {
        connections.push(...right_open);
    }

    // check left point
    if (x > 0 && right_open.includes(map[x - 1][y])) {
        connections.push(...left_open);
    }

    const duplicateConnections = connections.filter(
        (item, index) => connections.indexOf(item) !== index
    );
    return duplicateConnections;
}

function first_occurence_of(char, map) {
    for (let y = 0; y < map.length; y++) {
        const line = map[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] === char) {
                return { x, y };
            }
        }
    }
}
