/**
 * starting IQR bench
 * avarage time part 2:
 */

export default function solve(input) {
    const matrices = input
        .split('\n\n')
        .map((mirror) => mirror.split('\n').map((line) => line.split('')));

    let sum = 0;

    for (let i = 0; i < matrices.length; i++) {
        const matrix = matrices[i];

        const columns_count = find_vertical_reflection(matrix, 1);
        const rows_count = find_vertical_reflection(transpose(matrix), 1);

        sum += columns_count + 100 * rows_count;
    }

    return sum;
}

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function find_vertical_reflection(matrix, tolerance = 0) {
    x_axis: for (let x = 0; x < matrix[0].length - 1; x++) {
        let errors = 0;

        // check if vertical line mirrors
        for (let y = 0; y < matrix.length; y++) {
            if (matrix[y][x] !== matrix[y][x + 1] && ++errors > tolerance) {
                continue x_axis;
            }
        }

        // possible reflection found
        let xl = x;
        let xr = x + 1;
        while (--xl >= 0 && ++xr < matrix[0].length) {
            for (let y0 = 0; y0 < matrix.length; y0++) {
                if (matrix[y0][xl] !== matrix[y0][xr] && ++errors > tolerance) {
                    continue x_axis;
                }
            }
        }

        /**
         * * DAS ISSER!
         * * 👇 👇 👇 👇 👇 👇 👇 👇 👇 👇
         */
        if (errors !== tolerance) continue;
        /**
         * * 👆 👆 👆 👆 👆 👆 👆 👆 👆 👆
         * * DAS ISSER!
         */

        return x + 1;
    }

    return 0;
}
