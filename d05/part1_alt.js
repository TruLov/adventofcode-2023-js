export default function solve(input) {
    const lines = input.trim().split('\n');

    const seeds = lines[0].match(/\d+/g);
    const maps = convert_almanac_to_maps(lines.slice(2));

    const locations = [];
    for (const seed of seeds) {
        let location = seed;
        for (const map in maps) {
            location = convert_seed_value(location, maps[map]);
        }
        locations.push(location);
    }

    return Math.min(...locations);
}

function convert_seed_value(seed_str, map) {
    const seed = +seed_str;

    for (const range of map) {
        const [destination, source, length] = range;

        if (seed >= source && seed <= source + length) {
            const diff = seed - source;
            return destination + diff;
        }
    }
    return seed;
}

function convert_almanac_to_maps(lines) {
    const maps = {};
    let current_map_name = 0;
    for (let i = 0, lines_len = lines.length; i < lines_len; i++) {
        const line = lines[i];

        if (line === '') continue;

        if (line.match(/.*map:$/)) {
            maps[`${++current_map_name}`] = [];
            continue;
        }

        maps[`${current_map_name}`].push(line.split(' ').map(Number));
    }
    return maps;
}
