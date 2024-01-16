export default function solve(input) {
    const lines = input.trim().split('\n');

    const powers = [];

    for (let i = 0; i < lines.length; i++) {
        const sets = lines[i].split(':')[1].split(';').map(parseSet);

        const result = sets.reduce(
            (prev, set) => {
                Object.keys(set).forEach((color) => {
                    const current = set[`${color}`];
                    const total = prev[`${color}`];
                    if (current > total) {
                        prev[`${color}`] = current;
                    }
                });
                return prev;
            },
            {
                red: 0,
                green: 0,
                blue: 0,
            }
        );

        powers.push(Object.values(result).reduce((a, b) => a * b, 1));
    }
    return powers.reduce((a, b) => a + b, 0);
}

function parseSet(set) {
    return set.split(',').reduce((prev, curr) => {
        const color = curr.trim().split(' ');
        return { ...prev, [`${color[1]}`]: parseInt(color[0]) };
    }, {});
}
