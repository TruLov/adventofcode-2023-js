/**
 * starting IQR bench
 * avarage time part 2: 3.9720041661620272 ms
 */

export default function solve(input) {
    const [navigation_str, map_str] = input.split('\n\n');
    const lines = map_str.split('\n');
    const map = generate_map(lines);

    const steps = lines
        .filter((line) => line[2] === 'Z')
        .map((line) => min_steps(line.slice(0, 3), map, navigation_str))
        .reduce(lcm);

    return steps;
}

function min_steps(start, map, navigation_str) {
    let current_pos = start;
    let steps = 0;
    for (;;) {
        for (let i = 0, nav_len = navigation_str.length; i < nav_len; i++) {
            steps++;
            const dir = navigation_str[i];
            // current_pos = dir === 'R' ? map.get(current_pos).R : map.get(current_pos).L;
            current_pos = map.get(current_pos)[dir];
            if (current_pos[2] === 'Z') {
                return steps;
            }
        }
    }
}

function generate_map(lines) {
    const map = new Map();
    for (let i = 0, lines_len = lines.length; i < lines_len; i++) {
        const element = lines[i];
        const tuple = element.match(/[\w]{3},\s[\w]{3}/)[0];
        const [L, R] = tuple.split(', ');
        map.set(element.slice(0, 3), { L, R });
    }
    return map;
}

// const lcm = (a, b) => (a * b) / gcd(a, b);
function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// const gcd = (a, b) => (a ? gcd(b % a, a) : b);
function gcd(a, b) {
    return a ? gcd(b % a, a) : b;
}
