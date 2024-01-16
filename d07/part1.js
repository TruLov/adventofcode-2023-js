const STRENGTH = {
    A: 12,
    K: 11,
    Q: 10,
    J: 9,
    T: 8,
    9: 7,
    8: 6,
    7: 5,
    6: 4,
    5: 3,
    4: 2,
    3: 1,
    2: 0,
};

export default function solve(input) {
    const lines = input.trim().split('\n');

    const map_of_hands = lines.sort(compare_hands).reduce(
        (map, line) => {
            const hand = line.match(/^\w+/)[0];
            const mapped_hand = char_to_map(hand);

            switch (find_most_dupes(mapped_hand)) {
                case 5:
                    map.five.push(line);
                    break;
                case 4:
                    map.four.push(line);
                    break;
                case 3:
                    if (mapped_hand.size === 2) {
                        map.full.push(line);
                    } else {
                        map.three.push(line);
                    }
                    break;
                case 2:
                    if (mapped_hand.size === 2) {
                        map.full.push(line);
                    } else if (mapped_hand.size === 3) {
                        map.two.push(line);
                    } else {
                        map.one.push(line);
                    }
                    break;
                default:
                    map.high.push(line);
                    break;
            }
            return map;
        },
        {
            five: [],
            four: [],
            full: [],
            three: [],
            two: [],
            one: [],
            high: [],
        }
    );

    const ranking = [
        ...map_of_hands['high'],
        ...map_of_hands['one'],
        ...map_of_hands['two'],
        ...map_of_hands['three'],
        ...map_of_hands['full'],
        ...map_of_hands['four'],
        ...map_of_hands['five'],
    ];

    let sum = 0;
    for (let i = 0; i < ranking.length; i++) {
        const bid = parseInt(ranking[i].split(' ')[1]);
        sum += (i + 1) * bid;
    }

    return sum;
}

function char_to_map(hand) {
    const dupe_map = new Map();

    for (let i = 0, hand_len = hand.length; i < hand_len; i++) {
        const char = hand[i];
        if (dupe_map.has(char)) {
            dupe_map.set(char, dupe_map.get(char) + 1);
        } else {
            dupe_map.set(char, 1);
        }
    }

    return dupe_map;
}

function find_most_dupes(map) {
    for (const [_, count] of map) {
        if (count > 1) {
            return count;
        }
    }
}

function compare_hands(a, b) {
    for (let i = 0; i < 5; i++) {
        if (STRENGTH[a[i]] < STRENGTH[b[i]]) return -1;
        if (STRENGTH[a[i]] > STRENGTH[b[i]]) return 1;
    }
    return 0;
}
