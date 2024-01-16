/**
 * starting IQR bench
 * avarage time part 1: 1.2417899979485405 ms
 */

export default function solve(input) {
    let map = input.split('\n').map((line) => line.split(''));

    // expand universe
    for (let i = 0; i < map.length; i++) {
        if (!map[i].includes('#')) {
            map = [...map.slice(0, i), map[i], ...map.slice(i)];
            i++;
        }
    }

    map = transpose(map);

    for (let i = 0; i < map.length; i++) {
        if (!map[i].includes('#')) {
            map = [...map.slice(0, i), map[i], ...map.slice(i)];
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
            const min_steps = Math.abs(star_a.x - star_b.x) + Math.abs(star_a.y - star_b.y);
            sum += min_steps;
        }
    }

    return sum;
}

export function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}
