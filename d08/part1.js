/**
 * starting IQR bench
 * avarage time part 1: 0.9372001231253684 ms
 */

export default function solve(input) {
    const [navigation_str, map_str] = input.split('\n\n');
    const map = generate_map(map_str.split('\n'));

    let current_pos = 'AAA';

    let steps = 0;
    const nav_len = navigation_str.length;
    for (;;) {
        for (let i = 0; i < nav_len; i++) {
            steps++;
            const dir = navigation_str[i];
            current_pos = dir === 'R' ? map.get(current_pos).right : map.get(current_pos).left;
            if (current_pos === 'ZZZ') {
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
        const [left, right] = tuple.split(', ');
        map.set(element.slice(0, 3), { left, right });
    }
    return map;
}
