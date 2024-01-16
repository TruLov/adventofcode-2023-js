/**
 * starting IQR bench
 * avarage time part 1: 3.093511087553842 ms
 */

export default function solve(input) {
    const { workflows, ratings } = parse_input(input);

    const result_vec = [];
    for (let i = 0; i < ratings.length; i++) {
        let result = 'in';
        while (!(result === 'A' || result === 'R')) {
            result = check(ratings[i], workflows.get(result));
        }

        result_vec.push([result, ratings[i]]);
    }

    const sum = result_vec
        .filter(([result]) => result === 'A')
        .flatMap(([_, rating]) => Object.values(rating).map(Number))
        .reduce((a, b) => a + b, 0);
    return sum;
}

function check(rating, workflow) {
    const w = [...workflow];

    while (w.length > 1) {
        // s<1351:px
        const [check_template, target] = w.shift().split(':');
        const check = check_template
            .replace('x', rating.x)
            .replace('m', rating.m)
            .replace('a', rating.a)
            .replace('s', rating.s);
        const is_passing = eval(check);

        if (is_passing) {
            return target;
        }
    }

    return w[0];
}

function parse_input(input) {
    const [workflows_str, ratings_str] = input.split('\n\n');

    const workflows = new Map();
    workflows_str.split('\n').forEach((line) => {
        const [name] = line.match(/^\w+/);
        const obj = line.slice(name.length + 1, -1).split(',');
        // .map((pair) => pair.split(':'))
        // .reduce((o, [key, val]) => ({ ...o, [`${key}`]: val }), {});

        workflows.set(name, obj);
    });

    // const gen_parsable_json = (str) =>
    //     str.replace('{', '{"').replaceAll('=', '":').replaceAll(',', ',"');
    // const ratings = ratings_str.split('\n').map(gen_parsable_json).map(JSON.parse);
    const ratings = ratings_str
        .replaceAll('=', ':')
        .split('\n')
        .map((line) =>
            line
                .slice(1, -1)
                .split(',')
                .map((pair) => pair.split(':'))
                .reduce((o, [key, val]) => ({ ...o, [`${key}`]: val }), {})
        );

    return { workflows, ratings };
}
