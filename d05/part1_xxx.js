export default function solve(data) {
    const lines = data.split('\n\n');
    const seeds = lines[0].match(/\d+/g).map(Number);

    const maps = convert_almanac_to_maps(lines.slice(1));

    let lowest = Infinity;
    for (let seed of seeds) {
        for (const seedMap of maps) {
            seed = transform_seed(seed, seedMap);
        }
        if (seed < lowest) {
            lowest = seed;
        }
    }
    return lowest;
}

function transform_seed(seed, mapping) {
    for (const seedMap of mapping) {
        const lower = parseInt(seedMap[0]);
        const range = parseInt(seedMap[1]);
        const destination = parseInt(seedMap[2]);
        if (seed >= lower && seed < lower + range) {
            return seed - lower + destination;
        }
    }
    return seed;
}

function convert_almanac_to_maps(lines) {
    const mappings = [];

    for (let i = 0, lines_len = lines.length; i < lines_len; i++) {
        mappings.push(
            construct_map(lines.shift().split(':')[1].replaceAll('\n', ' ').slice(1).split(' '))
        );
    }

    return mappings;
}

function construct_map(arr) {
    const rangePairs = [];
    for (let i = 0; i < arr.length; i += 3) {
        const n = parseInt(i);
        const destination = parseInt(arr[n]);
        const source = parseInt(arr[n + 1]);
        const range = parseInt(arr[n + 2]);
        rangePairs.push([source, range, destination]);
    }
    return rangePairs;
}
