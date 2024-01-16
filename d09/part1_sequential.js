/**
 * starting IQR bench
 * avarage time part 1: 1.1800152355862648 ms (without check)
 ** avarage time part 1: 1.8539059001494218 ms (with Set-check)
 *? avarage time part 1: 1.200520428564731 ms (new check)
 */

export default function solve(input) {
    const sum = input
        .split('\n')
        .reduce((current_sum, line) => current_sum + process_line(line.match(/[-\d]+/g)), 0);
    return sum;
}

function process_line(line) {
    const pyramid = [line.map(Number)];

    const line_len = line.length;
    for (let i = 0; i < line_len; i++) {
        pyramid.push(calc_new_row(pyramid[pyramid.length - 1]));

        //* Set-check is slow
        // if (new Set(pyramid[i + 1]).size === 1) break;

        //? new check
        // if (pyramid[i + 1] === 0 && new Set(pyramid[i + 1]).size === 1) break;
    }

    const lines_greatest = pyramid.reduce((s, line) => s + (line[line.length - 1] ?? 0), 0);
    return lines_greatest;
}

function calc_new_row(lowest_row) {
    const new_row = [];
    const row_len = lowest_row.length - 1;
    for (let i = 0; i < row_len; i++) {
        new_row.push(lowest_row[i + 1] - lowest_row[i]);
    }
    return new_row;
}
