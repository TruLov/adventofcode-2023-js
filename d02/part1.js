const RULES = {
    red: 12,
    green: 13,
    blue: 14,
};
const COLORS = Object.keys(RULES);

export default function solve(input) {
    const lines = input.trim().split('\n');

    let sum = 0;
    lines: for (let i = 0; i < lines.length; i++) {
        const sets = lines[i].split(':')[1].split(';').map(parseSet);

        for (let j = 0; j < sets.length; j++) {
            const set = sets[j];

            for (let k = 0; k < COLORS.length; k++) {
                const color = COLORS[k];
                if (set[color] && set[color] > RULES[color]) continue lines;
            }
        }

        sum += i + 1;
    }

    return sum;
}

function parseSet(set) {
    return set.split(',').reduce((prev, curr) => {
        const color = curr.trim().split(' ');
        return { ...prev, [`${color[1]}`]: parseInt(color[0]) };
    }, {});
}
