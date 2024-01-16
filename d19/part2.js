/**
 * starting IQR bench
 * avarage time part 2:
 */

export default function solve(input) {
    const { workflows } = parse_input(input);

    const ranges = ['x', 'm', 'a', 's'].map((key) => [key, [1, 4000]]);

    const sum = rekursion(Object.fromEntries(ranges), workflows, 'in');
    return sum;
}

function rekursion(ranges, workflows, wf_name) {
    if (wf_name === 'R') return 0;
    if (wf_name === 'A') return Object.values(ranges).reduce((a, b) => a * (b[1] - b[0] + 1), 1);

    let count = 0;
    workflows.get(wf_name).forEach((rule) => {
        const [check, target] = rule.split(':');
        const [rating, operator, ...rest] = check;
        const comparator = Number(rest.join(''));

        const next = JSON.parse(JSON.stringify(ranges));
        if (operator === '<') next[rating][1] = (ranges[rating][0] = comparator) - 1;
        if (operator === '>') next[rating][0] = (ranges[rating][1] = comparator) + 1;
        count += rekursion(next, workflows, target ?? rule);
    });

    return count;
}

function parse_input(input) {
    const [workflows_str, ratings_str] = input.split('\n\n');

    const workflows = new Map();
    workflows_str.split('\n').forEach((line) => {
        const [name] = line.match(/^\w+/);
        const obj = line.slice(name.length + 1, -1).split(',');

        workflows.set(name, obj);
    });

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
