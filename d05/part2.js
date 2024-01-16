export default function solve(data) {
    const lines = data.split('\n\n');
    const seeds = lines[0].match(/\d+/g).map(Number);

    const maps = convert_almanac_to_maps(lines.slice(1));

    let lowest = Infinity;
    for (let i = 0; i < seeds.length; i += 2) {
        const n = parseInt(i);
        let testSeeds = [seeds[n]];
        let ranges = [seeds[n + 1]];
        for (const map of maps) {
            [testSeeds, ranges] = processRangeSeeds(testSeeds, ranges, map);
        }

        for (const seed of testSeeds) {
            if (seed < lowest) {
                lowest = seed;
            }
        }
    }
    return lowest;
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

function processRangeSeeds(seeds, ranges, seedMaps) {
    const newSeeds = [];
    const newRanges = [];
    const fragments = seeds;
    const rangeFragments = ranges;
    while (fragments.length !== 0) {
        const seedBottom = fragments.pop();
        const seedRange = rangeFragments.pop();
        const seedTop = seedBottom + seedRange;
        const oldSeedsLength = newSeeds.length;
        for (let m = 0; m < seedMaps.length && oldSeedsLength === newSeeds.length; m++) {
            const mapBottom = seedMaps[m][0];
            const mapRange = seedMaps[m][1];
            const mapTop = mapBottom + mapRange;
            const dest = seedMaps[m][2];
            //Just transform what is only in the range
            //Iterate over fragments until no changes
            if (seedBottom < mapBottom && seedTop > mapTop) {
                fragments.push(seedBottom);
                rangeFragments.push(mapBottom - seedBottom);

                newSeeds.push(dest);
                newRanges.push(mapTop - mapBottom);

                fragments.push(mapTop);
                rangeFragments.push(seedTop - mapTop);
                //split into 3rds
            } else if (seedBottom < mapBottom && seedTop > mapBottom) {
                fragments.push(seedBottom);
                rangeFragments.push(mapBottom - seedBottom);

                newSeeds.push(dest);
                newRanges.push(seedTop - mapBottom);
                //split into mapBottom half
            } else if (seedBottom >= mapBottom && seedBottom < mapTop && seedTop > mapTop) {
                newSeeds.push(seedBottom - mapBottom + dest);
                newRanges.push(mapTop - seedBottom - 1);

                fragments.push(mapTop);
                rangeFragments.push(seedTop - mapTop);
                //split into mapTop half
            } else if (seedBottom >= mapBottom && seedTop <= mapTop) {
                newSeeds.push(seedBottom - mapBottom + dest);
                newRanges.push(seedRange);
                //No split. just transform
            }
        }
        if (newSeeds.length === oldSeedsLength) {
            newSeeds.push(seedBottom);
            newRanges.push(seedRange);
        }
    }

    return [newSeeds, newRanges];
}
