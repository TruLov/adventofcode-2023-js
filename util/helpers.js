import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { iqr_bench, micro_bench } from './bench.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function solve(solver, input, id = '?') {
    const text = `part ${id}`;
    if (!solver) {
        console.log(`${text} not found`);
        return;
    }

    console.time(text);
    const result = solver(input);
    console.timeEnd(text);

    return result;
}

export function bench(solver, input, iterations, type, id = 'fn') {
    if (!solver) {
        console.log(`${id} not found`);
        return;
    }

    let avrg_time = -1;
    switch (type) {
        case 'micro':
            console.log('starting micro benchmark');
            avrg_time = micro_bench(iterations, solver, input);
            break;
        case 'iqr':
        default:
            console.log('starting IQR bench');
            avrg_time = iqr_bench(iterations, solver, input);
            break;
    }

    return avrg_time;
}

export function get_dir_path_abs(day) {
    const file_path = path.resolve(__dirname, '..', `d${`${day}`.padStart(2, '0')}`);
    return file_path;
}

export function read_input(dir_path, file_name) {
    const options = { encoding: 'utf8', flag: 'r' };
    const file_path = path.join(dir_path, file_name);
    const content = fs.readFileSync(file_path, options);
    return content;
}

export async function fetch_solvers(dir_path) {
    const [solver1, solver2] = await Promise.all([
        optionalImport(`${dir_path}/part1.js`),
        optionalImport(`${dir_path}/part2.js`),
    ]);
    return { solver1, solver2 };
}

async function optionalImport(path) {
    try {
        const module = await import(path);
        return module.default;
    } catch (e) {
        return console.info(e.message);
    }
}
