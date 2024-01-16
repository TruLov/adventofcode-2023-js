#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import HeapProfiler from '@clinic/heap-profiler';

import { get_dir_path_abs, read_input, fetch_solvers, solve, bench } from './util/helpers.js';

await yargs(hideBin(process.argv))
    .scriptName('aoc')
    .usage('$0 command [arguments] [options]')
    .command(
        'solve <day> [options]',
        'run solver on selected day',
        (yargs) => {
            yargs.positional('day', {
                type: 'string',
                default: '1',
                describe: 'the day to solve',
            });
            yargs.options({
                f: {
                    alias: 'filename',
                    demandOption: false,
                    default: 'input.txt',
                    describe: 'specify input file name (searches in respective folder ./dxx)',
                    type: 'string',
                },
            });
        },
        async function (argv) {
            const { day, filename } = argv;
            console.log(`🎄 trying to solve day ${day} 🎄`);

            const dir_path = get_dir_path_abs(day);
            const input = read_input(dir_path, filename);
            const { solver1, solver2 } = await fetch_solvers(dir_path);

            console.log(solve(solver1, input, '1'));
            console.log(solve(solver2, input, '2'));
        }
    )
    .command(
        'bench <day> [options]',
        'test performance of the selected day',
        (yargs) => {
            yargs.positional('day', {
                type: 'string',
                default: '1',
                describe: 'the day to test',
            });
            yargs.options({
                f: {
                    alias: 'filename',
                    demandOption: false,
                    default: 'input.txt',
                    describe: 'specify input file name (searches in respective folder ./dxx)',
                    type: 'string',
                },
                i: {
                    alias: 'iterations',
                    demandOption: false,
                    default: 100,
                    describe: 'number of iterations to run each solver fn',
                    type: 'number',
                },
                t: {
                    alias: 'type',
                    demandOption: false,
                    default: 'iqr',
                    describe: 'specify bench type [iqr|micro]',
                    type: 'string',
                },
            });
        },
        async function (argv) {
            const { day, filename, iterations, type } = argv;
            console.log(`🎅 start running day ${day} both parts ${iterations} times 🎅`);

            const dir_path = get_dir_path_abs(day);
            const input = read_input(dir_path, filename);
            const { solver1, solver2 } = await fetch_solvers(dir_path);

            const avrg_time_1 = bench(solver1, input, iterations, type, 'part1');
            console.log(`avarage time part 1: ${avrg_time_1} ms`);

            const avrg_time_2 = bench(solver2, input, iterations, type, 'part2');
            console.log(`average time part 2: ${avrg_time_2} ms`);
        }
    )
    .command(
        'heap <day> [options]',
        'analyzing allocations of the selected day',
        (yargs) => {
            yargs.positional('day', {
                type: 'string',
                default: '1',
                describe: 'the day to test',
            });
            yargs.options({
                f: {
                    alias: 'filename',
                    demandOption: false,
                    default: 'input.txt',
                    describe: 'specify input file name (searches in respective folder ./dxx)',
                    type: 'string',
                },
                i: {
                    alias: 'iterations',
                    demandOption: false,
                    default: 100,
                    describe: 'number of iterations to run each solver fn',
                    type: 'number',
                },
                t: {
                    alias: 'type',
                    demandOption: false,
                    default: 'iqr',
                    describe: 'specify bench type [iqr|micro]',
                    type: 'string',
                },
            });
        },
        async function (argv) {
            const { day, filename, iterations, type } = argv;
            console.log(`🎅 start running day ${day} both parts ${iterations} times 🎅`);

            const dir_path = get_dir_path_abs(day);
            const input = read_input(dir_path, filename);
            const { solver1, solver2 } = await fetch_solvers(dir_path);

            const heapProfiler = new HeapProfiler();

            heapProfiler.collect(['node', './path-to-script.js'], function (err, filepath) {
                if (err) throw err;

                heapProfiler.visualize(filepath, filepath + '.html', function (err) {
                    if (err) throw err;
                });
            });

            const avrg_time_1 = bench(solver1, input, iterations, type, 'part1');
            console.log(`avarage time part 1: ${avrg_time_1} ms`);

            const avrg_time_2 = bench(solver2, input, iterations, type, 'part2');
            console.log(`average time part 2: ${avrg_time_2} ms`);
        }
    )
    .help().argv;
