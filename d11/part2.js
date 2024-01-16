/**
 * starting IQR bench
 * avarage time part 1: 76.54008638989795 ms
 */

const SPACE_SIZE = 1000000;

export default function solve(input) {
    let map = input.split('\n').map((line) => line.split(''));

    // expand universe
    for (let i = 0; i < map.length; i++) {
        if (!map[i].includes('#')) {
            map[i] = map[i].map(() => 'X');
            i++;
        }
    }

    map = transpose(map);

    for (let i = 0; i < map.length; i++) {
        if (!map[i].includes('#')) {
            map[i] = map[i].map(() => 'X');
            i++;
        }
    }

    map = transpose(map);

    // finde single stars
    const stars = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') {
                stars.push({ x, y });
            }
        }
    }

    let sum = 0;

    // build pairs
    for (let a = 0; a < stars.length; a++) {
        for (let b = a + 1; b < stars.length; b++) {
            const star_a = stars[a];
            const star_b = stars[b];

            // connect them
            let y0, yn, x0, xn;
            if (star_a.y < star_b.y) {
                y0 = star_a.y;
                yn = star_b.y;
            } else {
                y0 = star_b.y;
                yn = star_a.y;
            }

            if (star_a.x < star_b.x) {
                x0 = star_a.x;
                xn = star_b.x;
            } else {
                x0 = star_b.x;
                xn = star_a.x;
            }

            let min_steps = 0;
            for (y0; y0 < yn; ++y0) {
                if (map[y0][x0] === 'X') {
                    min_steps += SPACE_SIZE - 1;
                }
                min_steps++;
            }
            for (x0; x0 < xn; ++x0) {
                if (map[y0][x0] === 'X') {
                    min_steps += SPACE_SIZE - 1;
                }
                min_steps++;
            }
            sum += min_steps;
        }
    }

    return sum;
}

export function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
