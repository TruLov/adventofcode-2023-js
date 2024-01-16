/**
 * starting IQR bench
 * avarage time part 2: 4.8458764255046844 ms
 * * global cache
 */
const FOLD_COUNT = 5;
const cache = new Map();

let cache_hits = 0;

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

    console.log(`cache_hits: ${cache_hits}`);
    return sum;
}

function count_possibilities(pattern, groups) {
    const cache_key = `${pattern},${groups}`;
    if (cache.has(cache_key)) {
        ++cache_hits;
        return cache.get(cache_key);
    }

    const min_remaining_allocations = groups.reduce((a, b) => a + b, 0) + groups.length - 1;
    if (pattern.length < min_remaining_allocations) {
        return 0;
    }

    if (groups.length === 0 && /#/.test(pattern)) {
        return 0;
    }

    if (pattern.length === 0 && groups.length === 0) {
        return 1;
    }

    let result = 0;
    switch (pattern[0]) {
        case '.':
            result = count_possibilities(pattern.slice(1), groups);
            break;

        case '#': {
            const [current_group, ...remaining_groups] = groups;

            const includes_dot = pattern.slice(0, current_group).includes('.');
            const is_next_valid = pattern[current_group] !== '#';

            if (!includes_dot && is_next_valid) {
                result = count_possibilities(pattern.slice(current_group + 1), remaining_groups);
            }
            break;
        }

        case '?':
            result =
                count_possibilities('#' + pattern.slice(1), groups) +
                count_possibilities('.' + pattern.slice(1), groups);
            break;
    }

    cache.set(cache_key, result);
    return result;
}
