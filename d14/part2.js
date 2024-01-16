/**
 * starting IQR bench
 * avarage time part 2:
 */

const CYCLES_COUNT = 1000000000;

const cache = [];

export default function solve(input) {
    const lines = input.split('\n');
    const matrix = lines.map((line) => line.split(''));

    let cycled = matrix;
    for (let i = 0; i < CYCLES_COUNT; i++) {
        const cache_key = matrix.map((line) => line.join('')).join('');
        const loop_start_idx = cache.findIndex((entry) => entry.key === cache_key);
        if (loop_start_idx >= 0) {
            const loop_len = cache.length - loop_start_idx;
            const result_idx = (CYCLES_COUNT - i - 1) % loop_len;
            cycled = cache[result_idx + loop_start_idx].val;
            break;
        }

        cycled = cycle(cycled);
        cache.push({ key: cache_key, val: cycled.map((l) => l.map((c) => c)) });
    }

    const sum = cycled.reduce((sum, line, i, arr) => {
        const rock_count = (line.join('').match(/O/g) || []).length;
        const load = arr.length - i;
        return sum + rock_count * load;
    }, 0);

    return sum;
}

function cycle(matrix) {
    const north = roll_north(matrix);
    const west = roll_west(north);
    const south = roll_south(west);
    const east = roll_east(south);

    return east;
}

function roll_north(matrix) {
    // for every column...
    columns: for (let x = 0; x < matrix[0].length; x++) {
        let swapped = true;
        // ... bubble sort north
        for (let y = 0; y < matrix.length; y++) {
            if (!swapped) {
                continue columns;
            }
            swapped = false;
            for (let y1 = 0; y1 < matrix.length - y - 1; y1++) {
                if (matrix[y1][x] === '.' && matrix[y1 + 1][x] === 'O') {
                    matrix[y1][x] = 'O';
                    matrix[y1 + 1][x] = '.';
                    swapped = true;
                }
            }
        }
    }
    return matrix;
}

function roll_west(matrix) {
    // for every row...
    rows: for (let y = 0; y < matrix.length; y++) {
        let swapped = true;
        // ... bubble sort west
        for (let x = 0; x < matrix.length; x++) {
            if (!swapped) {
                continue rows;
            }
            swapped = false;
            for (let x0 = 0; x0 < matrix[y].length - x - 1; x0++) {
                if (matrix[y][x0] === '.' && matrix[y][x0 + 1] === 'O') {
                    matrix[y][x0] = 'O';
                    matrix[y][x0 + 1] = '.';
                    swapped = true;
                }
            }
        }
    }
    return matrix;
}

function roll_south(matrix) {
    // for every column...
    columns: for (let x = 0; x < matrix[0].length; x++) {
        let swapped = true;
        // ... bubble sort south
        for (let y = 0; y < matrix.length; y++) {
            if (!swapped) {
                continue columns;
            }
            swapped = false;
            for (let y1 = 0; y1 < matrix.length - y - 1; y1++) {
                if (matrix[y1][x] === 'O' && matrix[y1 + 1][x] === '.') {
                    matrix[y1][x] = '.';
                    matrix[y1 + 1][x] = 'O';
                    swapped = true;
                }
            }
        }
    }
    return matrix;
}

function roll_east(matrix) {
    // for every row...
    rows: for (let y = 0; y < matrix.length; y++) {
        let swapped = true;
        // ... bubble sort east
        for (let x = 0; x < matrix[y].length; x++) {
            if (!swapped) {
                continue rows;
            }
            swapped = false;
            for (let x0 = 0; x0 < matrix[y].length - x - 1; x0++) {
                if (matrix[y][x0] === 'O' && matrix[y][x0 + 1] === '.') {
                    matrix[y][x0] = '.';
                    matrix[y][x0 + 1] = 'O';
                    swapped = true;
                }
            }
        }
    }
    return matrix;
}
