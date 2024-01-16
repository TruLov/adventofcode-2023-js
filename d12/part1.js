/**
 * starting IQR bench
 * avarage time part 1:
 */

export default function solve(input) {
    const sum = input
        .split('\n')
        .map((line) => line.split(' '))
        .map((line) => count_possibilities(line[0], line[1].split(',').map(Number)))
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

// function count_possibilities({ row, groups }) {
//     // recursion ???
//     if (!row) {
//         if (!groups) {
//             return 1;
//         } else {
//             return 0;
//         }
//     }

//     switch (row[0]) {
//         case '.':
//             return count_possibilities({ row: row.slice(1), groups });
//         case '#':
//             break;
//         case '?':
//             break;
//     }

//     console.log(-1);
// }

// .#????????#??.? 1,1,3,1,1
function parse_line(line) {
    const [pattern_str, groups_str] = line.split(' ');
    // const pattern = pattern_str.split(/\.+/); // ['#????????#??', '?']
    const groups = groups_str.match(/\d+/g).map(Number); // [ 1,1,3,1,1 ]
    return { pattern: pattern_str, groups };
}
