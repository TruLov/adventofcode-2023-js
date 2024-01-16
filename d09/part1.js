/**
 * starting IQR bench
 * avarage time part 1: 0.8563948479412743 ms
 */

export default function solve(input) {
    return input
        .split('\n')
        .map((line) => line.match(/[-\d]+/g).map(Number))
        .map((line) => extrapolate_foreward(line))
        .reduce((total, line_sum) => total + line_sum, 0);
}

function extrapolate_foreward(line) {
    const pyramid = build_pyramid(line);
    const lines_greatest = pyramid.reduce((s, line) => s + line[line.length - 1], 0);
    return lines_greatest;
}

function build_pyramid(line) {
    const pyramid = [[line[0]]];

    const line_len = line.length;
    for (let i = 1; i < line_len; i++) {
        pyramid[0].push(line[i]);
        // add_pyramid_column
        const p_len = pyramid.length;
        for (let i = 0; i < p_len; i++) {
            // calc diff for every line > 0
            const line = pyramid[i];
            const line_len = line.length;
            const diff = line[line_len - 1] - line[line_len - 2];
            if (!pyramid[i + 1]) {
                pyramid.push([diff]);
            } else {
                pyramid[i + 1].push(diff);
            }
        }
    }
    return pyramid;
}
