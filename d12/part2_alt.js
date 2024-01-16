/**
 * starting IQR bench
 * avarage time part 2: Infinity
 */

const FOLD_COUNT = 5;

export default function solve(input) {
    const sum = input
        .split('\n')
        .map((line) => line.split(' '))
        .map(([pattern, groups]) => [
            Array(FOLD_COUNT).fill(pattern).join('?'),
            Array(FOLD_COUNT).fill(groups).join(','),
        ])
        .map(([pattern, groups]) => count_possibilities(pattern, groups.split(',').map(Number)))
        .reduce((a, b) => a + b, 0);

    return sum;
}

function count_possibilities(pattern, groups) {
    if (pattern.length === 0) {
        if (groups.length === 0) {
            return 1;
        }
        return 0;
    }

    if (groups.length === 0) {
        if (/#/.test(pattern)) {
            return 0;
        }
        return 1;
    }

    const min_remaining_allocations = groups.reduce((a, b) => a + b, 0) + groups.length - 1;
    if (pattern.length < min_remaining_allocations) {
        return 0;
    }

    switch (pattern[0]) {
        case '.':
            // dots are irrelevant...
            return count_possibilities(pattern.slice(1), groups);

        case '#': {
            // found start, here we check if we fit in...
            const [current_group, ...reamining_groups] = groups;
            if (!pattern_fits_group(pattern, current_group)) {
                return 0;
            }

            // .. and if neighbour is not making our group bigger
            const right_neighbour = pattern[current_group];
            if (right_neighbour === '#') {
                return 0;
            }

            return count_possibilities(pattern.slice(current_group + 1), reamining_groups);
        }

        case '?':
            // questionmark could be '#' or '.', so we test both
            return (
                count_possibilities('#' + pattern.slice(1), groups) +
                count_possibilities('.' + pattern.slice(1), groups)
            );
    }
}

function pattern_fits_group(pattern, group) {
    for (let i = 0; i < group; i++) {
        if (pattern[i] === '.') {
            return false;
        }
    }
    return true;
}
