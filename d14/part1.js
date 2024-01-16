/**
 * starting IQR bench
 * avarage time part 1:
 */

export default function solve(input) {
    const p_reflector = input.split('\n').map((line) => line.split(''));

    // for evey column...
    for (let x = 0; x < p_reflector[0].length; x++) {
        // ... bubble sort
        for (let y0 = 0; y0 < p_reflector.length; y0++) {
            for (let y1 = 0; y1 < p_reflector.length - y0 - 1; y1++) {
                if (p_reflector[y1][x] === '.' && p_reflector[y1 + 1][x] === 'O') {
                    const temp = p_reflector[y1][x];
                    p_reflector[y1][x] = p_reflector[y1 + 1][x];
                    p_reflector[y1 + 1][x] = temp;
                }
            }
        }
    }

    const sum = p_reflector.reduce((sum, line, i, arr) => {
        const rock_count = (line.join('').match(/O/g) || []).length;
        const load = arr.length - i;
        return sum + rock_count * load;
    }, 0);

    return sum;
}
