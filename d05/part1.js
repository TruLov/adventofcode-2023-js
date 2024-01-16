export default function solve(data) {
    const lines = data.split('\n');
    const { seeds, maps } = parseAlmanac(lines);

    // translate the seed position by running it through the almanacs maps.
    const seedPosition = (x) =>
        maps.reduce((current, ranges) => {
            const index = binarySearch(ranges, current, rCompare);
            return index >= 0 ? rTranslate(current, ranges[index]) : current;
        }, x);

    return Math.min(...seeds.map(seedPosition));
}

const parseAlmanac = (lines) => {
    // parse a x-to-y map and its entries.
    const parseMap = (start) => {
        const ranges = [];
        // skip start x-to-y line.
        let i = start + 1;
        // consume all range entries until an empty line is reached.
        while (i < lines.length && lines[i]) {
            const range = parseDelimited(lines[i], ' ', Number);
            // convert length to end (src + length)
            range[2] += range[1];
            // sort ranges by start ascending.
            ranges.push(range);
            i++;
        }
        // ensure ranges are sorted by start ascending (for binary search)
        return [ranges.sort((a, b) => a[1] - b[1]), i];
    };
    // parse each x-to-y map.
    const parseMaps = (start) => {
        const maps = [];
        let i = start;
        while (i < lines.length) {
            const [ranges, newIndex] = parseMap(i);
            maps.push(ranges);
            i = newIndex + 1;
        }
        return maps;
    };
    return {
        seeds: parseDelimited(lines[0].split(':')[1].trim(), ' ', Number),
        maps: parseMaps(2),
    };
};

const parseDelimited = (str, delimiter, mapFn = (x) => x) => str.split(delimiter).map(mapFn);
const rTranslate = (x, r) => x - rStart(r) + rDest(r);
const rDest = (range) => range[0];
const rStart = (range) => range[1];
const rEnd = (range) => range[2];
const rCompare = (x, r) => {
    if (x < rStart(r)) {
        return -1;
    } else if (x >= rEnd(r)) {
        return 1;
    }
    return 0;
};
const binarySearch = (arr, item, compareFn) => {
    let l = 0;
    let u = arr.length - 1;
    while (l <= u) {
        const m = (l + u) >> 1;
        const comp = compareFn(item, arr[m]);
        if (comp < 0) {
            u = m - 1;
        } else if (comp > 0) {
            l = m + 1;
        } else {
            return m;
        }
    }
    return ~l;
};

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
