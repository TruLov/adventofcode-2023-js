/**
 * starting IQR bench
 * avarage time part 1:
 */

export default function solve(input) {
    const modules = parse(input);

    const broadcaster = modules.get('broadcaster');

    const q = broadcaster.low();

    while (q.length) {
        const fn = q.shift();
        const res = fn();
        if (res) {
            q.push(...res);
        }
    }

    return -1;
}

function parse(input) {
    const modules = new Map();

    input
        .split('\n')
        .map((line) => line.split(' -> '))
        .map(([str, dest]) => [str, ...dest.split(', ')])
        .forEach((line) => {
            if (line[0][0] === '%') {
                modules.set(line.shift().slice(1), create_flipflop(modules, line));
            } else if (line[0][0] === '&') {
                modules.set(line.shift().slice(1), create_conjunction(modules, line));
            } else if (line[0][0] === 'b') {
                modules.set(line.shift(), create_broadcaster(modules, line));
            }
        });

    return modules;
}

function create_flipflop(modules, targets) {
    const on = false;
    function high() {}
    function low() {
        return targets.map((name) => {
            const target = modules.get(name);
            if (on) {
                console.log(`ff -low-> ${name}`);
                return function () {
                    target.low;
                };
            } else {
                console.log(`ff -high-> ${name}`);
                return target.high;
            }
        });
    }

    return { high, low };
}

function create_conjunction(modules, targets) {
    let last = 0;

    function high() {
        const tmp = last;
        last = 1;
        return send(tmp);
    }

    function low() {
        const tmp = last;
        last = 0;
        return send(tmp);
    }

    function send(pulse) {
        if (pulse) {
            return targets.map((name) => {
                const target = modules.get(name);
                console.log(`cj -low-> ${name}`);
                return target.low;
            });
        } else {
            return targets.map((name) => {
                const target = modules.get(name);
                console.log(`cj -high-> ${name}`);
                return target.high;
            });
        }
    }

    return { high, low };
}

function create_broadcaster(modules, targets) {
    function high() {
        return targets.map((name) => {
            console.log(`bc -high-> ${name}`);
            return modules.get(name).high;
        });
    }
    function low() {
        return targets.map((name) => {
            console.log(`bc -low-> ${name}`);
            return modules.get(name).low;
        });
    }
    return { high, low };
}
