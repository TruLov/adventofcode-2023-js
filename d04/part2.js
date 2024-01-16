export default function solve(input) {
    const lines = input.trim().split('\n');
    let sum = 0;

    const split_idx = lines[0].split(':')[1].split('|')[0].match(/\d+/g).length + 1;

    const lines_length = lines.length;
    const total_cards = Array(lines_length).fill(1);

    for (let i = 0; i < lines_length; i++) {
        const line = lines[i].match(/\d+/g);
        const winning_nums = line.slice(1, split_idx);
        const my_nums = line.slice(split_idx, line.length);

        //! 1.725ms
        let idx = 1;
        for (let j = 0, my_nums_length = my_nums.length; j < my_nums_length; j++) {
            if (winning_nums.includes(my_nums[j])) {
                total_cards[i + idx++] += total_cards[i];
            }
        }

        //! 1.831ms
        // let result = 0;
        // let wins = 0;
        // for (let j = 0, my_nums_length = my_nums.length; j < my_nums_length; j++) {
        //     if (winning_nums.includes(my_nums[j])) {
        //         if (result === 0) {
        //             result = 1;
        //         } else {
        //             result *= 2;
        //         }
        //         wins++;
        //     }
        // }

        // for (let j = 1; j <= wins; j++) {
        //     total_cards[i + j] += total_cards[i];
        // }

        sum += total_cards[i];
    }

    return sum;
}
