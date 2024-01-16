export default function solve(input) {
    const lines = input.trim().split('\n');

    const seeds = lines[0]
        .match(/\d+\s\d+/g)
        .map((str) => str.split(' ').map(Number))
        .map((pair) => create_vector(pair[0], pair[1]));
    const maps = convert_almanac_to_vector_maps(lines.slice(2));

    const lowest_locations = [];

    // for (let i = 0, seeds_len = seeds.length; i < seeds_len; i++) {
    //     // 79 14
    //     const seed_vec = seed_pairs[i].split(' ').map(Number);
    //     const maps_keys = Object.keys(maps);
    //     // let lowest_location;

    //     // for (let j = 0, maps_len = maps_keys.length; j < maps_len; j++) {
    //     //     const map = maps[maps_keys[j]];

    //     //     for (let k = 0, map_len = map.length; k < map_len; k++) {
    //     //         const range = map[k];
    //     //         if (are_ranges_overlapping(seed_range, range)) {
    //     //             const current_lowest = Math.min(
    //     //                 convert_seed_value(range[0], map),
    //     //                 convert_seed_value(seed_range[0], map)
    //     //             );
    //     //             if (current_lowest < lowest_location) {
    //     //                 lowest_location = current_lowest;
    //     //             }
    //     //         }
    //     //     }
    //     // }
    //     // lowest_locations.push(lowest_location);
    // }

    // return Math.min(...lowest_locations);
    return;
}

function are_ranges_overlapping(range1, range2) {
    const [start1, length1] = range1;
    const [start2, length2] = range2;

    return (
        (start1 >= start2 && start2 + length2 >= start1) ||
        (start2 >= start1 && start1 + length1 >= start2)
    );
}

function location_of_seed(seed_str, maps) {
    let location = +seed_str;

    for (const map in maps) {
        for (const range of map) {
            const [destination, source, length] = range;

            if (location >= source && location <= source + length) {
                const diff = location - source;
                location = destination + diff;
            }
        }
    }

    return location;
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

function convert_almanac_to_vector_maps(lines) {
    const maps = [];
    let current_map = -1;
    for (let i = 0, lines_len = lines.length; i < lines_len; i++) {
        const line = lines[i];

        if (line === '') continue;

        if (line.match(/.*map:$/)) {
            maps.push([]);
            current_map++;
            continue;
        }

        const [projection, start, length] = line.split(' ').map(Number);
        maps[current_map].push(create_vector(start, length, projection));
    }
    return maps;
}

function create_vector(start, length, projection = 0) {
    return { from: start, to: start + length, length: length, projection: projection };
}
