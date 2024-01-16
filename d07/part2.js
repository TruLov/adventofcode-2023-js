const STRENGTH = {
    A: 12,
    K: 11,
    Q: 10,
    T: 8,
    9: 7,
    8: 6,
    7: 5,
    6: 4,
    5: 3,
    4: 2,
    3: 1,
    2: 0,
    J: -1,
};

const TYPES = {
    five: 6,
    four: 5,
    full: 4,
    three: 3,
    two_pairs: 2,
    one_pair: 1,
    high: 0,
};

function line_to_obj(line) {
    const [hand, bid_str] = line.split(' ');
    return { hand, bid: +bid_str, joker_count: hand.match(/J/g)?.length ?? 0 };
}

export default function solve(input) {
    const lines = input
        .trim()
        .split('\n') //TODO compare to line.match(/^\w+/)
        .map(line_to_obj)
        .map((line) => {
            if (line.joker_count >= 4) {
                //* JJJJJ | JJJJX
                return { ...line, type: 'five' };
            }

            const map_of_hand = char_to_map(line.hand);
            const different_cards = map_of_hand.size;

            if (different_cards === 1 || (line.joker_count !== 0 && different_cards === 2)) {
                //* JXXXX | JJXXX | JJJXX | JJJJX
                return { ...line, type: 'five' };
            }

            if (line.joker_count === 3) {
                //* JJJXY
                return { ...line, type: 'four' };
            }

            if (line.joker_count === 2) {
                //* JJXXY | JJXYZ
                switch (different_cards) {
                    case 3:
                        return { ...line, type: 'four' };
                    case 4:
                        return { ...line, type: 'three' };
                }
            }

            if (line.joker_count === 1) {
                //* JXXXY | JXXYY | JXXYZ | JXYZA

                const [_, highest_amount] = [...map_of_hand.entries()].reduce((a, e) =>
                    e[1] > a[1] ? e : a
                );

                switch (different_cards) {
                    case 3:
                        return highest_amount === 3
                            ? { ...line, type: 'four' }
                            : { ...line, type: 'full' };
                    case 4:
                        return { ...line, type: 'three' };
                    case 5:
                        return { ...line, type: 'one_pair' };
                }
            }

            // if (line.joker_count === 0)
            //* 12345 | 12344 | 12233 | 12333 | 11222 | 12222

            const [_, highest_amount] = [...map_of_hand.entries()].reduce((a, e) =>
                e[1] > a[1] ? e : a
            );

            switch (different_cards) {
                case 2:
                    return highest_amount === 4
                        ? { ...line, type: 'four' }
                        : { ...line, type: 'full' };
                case 3:
                    return highest_amount === 3
                        ? { ...line, type: 'three' }
                        : { ...line, type: 'two_pairs' };
                case 4:
                    return { ...line, type: 'one_pair' };
                case 5:
                    return { ...line, type: 'high' };
            }
        });

    const sorted_lines = lines.sort((a, b) => {
        if (TYPES[a.type] < TYPES[b.type]) return -1;
        if (TYPES[a.type] > TYPES[b.type]) return 1;

        for (let i = 0; i < 5; i++) {
            if (STRENGTH[a.hand[i]] < STRENGTH[b.hand[i]]) return -1;
            if (STRENGTH[a.hand[i]] > STRENGTH[b.hand[i]]) return 1;
        }

        return 0;
    });

    let sum = 0;
    for (let i = 0, lines_len = sorted_lines.length; i < lines_len; i++) {
        const { bid } = sorted_lines[i];
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
