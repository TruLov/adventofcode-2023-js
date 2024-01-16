/**
 * starting IQR bench
 * avarage time part 2: 0.4844064528180152 ms
 */

const DIR = {
    0: [1, 0],
    1: [0, 1],
    2: [-1, 0],
    3: [0, -1],
};

export default function solve(input) {
    const dig_plan = input.split('\n').map((line) => line.split(' '));

    let curr = [0, 0];
    const edges = [];

    for (let i = 0; i < dig_plan.length; i++) {
        const hex = dig_plan[i][2];
        const cmd = parseInt(hex.slice(7, 8));
        const len = parseInt(hex.slice(2, 7), 16);

        const next = [curr[0] + DIR[cmd][0] * len, curr[1] + DIR[cmd][1] * len];
        edges.push([curr, next]);
        curr = next;
    }

    // Trapezformel
    const area = edges.reduce(
        (area, [curr, next]) => area + (curr[0] * next[1] - curr[1] * next[0]) / 2,
        0
    );

    const border = dig_plan
        .map((line) => parseInt(line[2].slice(2, 7), 16))
        .reduce((a, b) => a + b, 0);
    const inner_area = pick_inner_area(area, border);
    return inner_area + border;
}

/**
 * @link <https://de.wikipedia.org/wiki/Satz_von_Pick>
 *
 * @param {Number} A Flächeninhalt des Polygons
 * @param {Number} R Anzahl der Gitterpunkte auf dem Rand des Polygons
 * @returns {Number} Anzahl der Gitterpunkte im Inneren des Polygons
 */
function pick_inner_area(A, R) {
    const I = A - R / 2 + 1;
    return I;
}
