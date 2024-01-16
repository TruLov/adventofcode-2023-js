const DIGIT_MAX_LEN = 3;

export default function solve(input) {
    const lines = input.trim().split('\n');

    let sum = 0;

    for (let y = 0, y_len = lines.length; y < y_len; y++) {
        const line = lines[y];
        for (let x = 0, x_len = line.length; x < x_len; x++) {
            if (!is_digit(line[x])) continue;

            const digit = get_digit(line.substring(x, x + DIGIT_MAX_LEN));
            const digit_len = digit.length;

            // x range
            const x0 = x - 1;
            const xl = x + digit_len;

            if (y !== 0 && test_x(lines[y - 1], x0, xl)) {
                sum += parseInt(digit);
            } else if (test_x(line, x0, xl)) {
                sum += parseInt(digit);
            } else if (y < y_len - 1 && test_x(lines[y + 1], x0, xl)) {
                sum += parseInt(digit);
            }

            x += digit_len - 1;
        }
    }

    return sum;
}

function test_x(line, x, length) {
    const str = line.substring(x, length + 1);
    return /[^.\d]/.test(str);
}

function is_digit(char) {
    return /^\d/.test(char);
}

function get_digit(str) {
    return str.match(/^\d+/)[0];
}
