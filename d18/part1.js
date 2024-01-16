/**
 * starting IQR bench
 * avarage time part 1: 0.6046810539145219 ms
 */

const DIR = {
    R: [1, 0],
    L: [-1, 0],
    D: [0, 1],
    U: [0, -1],
};

export default function solve(input) {
    const dig_plan = input.split('\n').map((line) => line.split(' '));

    let curr = [0, 0];
    const edges = [];

    for (let i = 0; i < dig_plan.length; i++) {
        const [cmd, len] = dig_plan[i];
        const next = [curr[0] + DIR[cmd][0] * len, curr[1] + DIR[cmd][1] * len];
        edges.push([curr, next]);
        curr = next;
    }

    // Trapezformel
    const area = edges.reduce(
        (area, [curr, next]) => area + (curr[0] * next[1] - curr[1] * next[0]) / 2,
        0
    );

    const outline = dig_plan.map((line) => Number(line[1])).reduce((a, b) => a + b, 0);
    const innerArea = pick_inner_area(area, outline);
    return innerArea + outline;
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
