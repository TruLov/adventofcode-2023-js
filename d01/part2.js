const VALUES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export default function solve(input) {
    const lines = input.trim().split('\n');
    const values = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let first, last;

        find_first: for (let j = 0; j < line.length; j++) {
            const frontBuffer = line.substring(0, j + 1);
            const foundFirst = findValues(frontBuffer);

            if (foundFirst) {
                first = foundFirst;
                break find_first;
            }
        }

        const line_length = line.length;
        find_last: for (let j = 0; j < line_length; j++) {
            const backBuffer = line.substring(line_length - j - 1, line_length);
            const foundLast = findValues(backBuffer);

            if (foundLast) {
                last = foundLast;
                break find_last;
            }
        }
        values.push(parseInt(`${first}${last}`));
    }

    const sum = values.reduce((a, b) => a + b, 0);
    return sum;
}

function findValues(buffer) {
    for (let i = 0; i < VALUES.length; i++) {
        if (buffer.includes(VALUES[i]) || buffer.includes(`${i + 1}`)) {
            return i + 1;
        }
    }
}
