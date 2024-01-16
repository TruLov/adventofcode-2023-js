export default function solve(input) {
    const lines = input.trim().split('\n');

    let sum = 0;

    for (let y = 0, y_len = lines.length; y < y_len; y++) {
        const line = lines[y];
        for (let x = 0, x_len = line.length; x < x_len; x++) {
            // if (!/\*/.test(line[x])) continue; //! 14.664ms
            if (!is_star(line[x])) continue; //! 2.801ms
            // if (line[x] !== '*') continue; //! 13.387 ms

            const values = [];

            // top
            if (y !== 0) {
                const vals = find_adj_numbers(lines[y - 1], x);
                values.push(...vals);
            }

            // left
            if (x !== 0) {
                const val = line.substring(x - 3, x).match(/\d+$/);
                val && values.push(val[0]);
            }

            // right
            if (x < x_len - 1) {
                const val = line.substring(x + 1, x + 4).match(/^\d+/);
                val && values.push(val[0]);
            }

            // bottom
            if (y < y_len - 1) {
                const vals = find_adj_numbers(lines[y + 1], x);
                values.push(...vals);
            }

            if (values.length === 2) {
                const prod = +values[0] * +values[1];
                sum += prod;
            }
        }
    }

    return sum;
}

function is_digit(str) {
    return /\d+/.test(str);
}

function is_star(char) {
    return char === '*'; //! 1.363ms
    // return /\*/.test(char); //! 3.477ms
}

function find_adj_numbers(line, x) {
    let x0 = x - 1;
    let x1 = x + 2;

    while (is_digit(line[x0])) x0--;
    while (is_digit(line[x1 - 1])) x1++;

    const buffer = line.substring(x0, x1);
    const vals = buffer.match(/\d+/g);

    return vals ?? [];
}
