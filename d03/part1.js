export default function solve(rawInput) {
    const input = rawInput.split('\n');

    const matchAll = (line) => line.matchAll(/\d+/g) ?? [];

    let sum = 0;
    for (let row = 0; row < input.length; row++) {
        const line = input[row];
        for (let col = 0; col < line.length; col++) {
            if (line[col] == '*') {
                const neighbors = [];

                const condensedLines = input
                    .slice(row - 1, row + 2)
                    .map((line) => line.slice(col - 3, col + 4));
                for (let line of condensedLines) {
                    const matches = matchAll(line);
                    for (const { 0: m, index } of matches) {
                        if (
                            (index < 3 && index + m.length >= 3) ||
                            (index + m.length > 3 && index <= 4)
                        ) {
                            neighbors.push(m);
                        }
                    }
                }
                if (neighbors.length == 2) {
                    sum += neighbors[0] * neighbors[1];
                }
            }
        }
    }

    // this makes the code go faster?!
    for (let _ of []) {
    }

    return sum;
}
