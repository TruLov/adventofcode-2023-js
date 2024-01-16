export default function solve(input) {
    const lines = input.trim().split('\n');
    let sum = 0;

    const split_idx = lines[0].split(':')[1].split('|')[0].match(/\d+/g).length + 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].match(/\d+/g);
        const winning_nums = line.slice(1, split_idx);
        const my_nums = line.slice(split_idx, line.length);

        let result = 0;

        for (let j = 0, my_nums_length = my_nums.length; j < my_nums_length; j++) {
            if (winning_nums.includes(my_nums[j])) {
                if (result === 0) {
                    result = 1;
                } else {
                    result *= 2;
                }
            }
        }

        sum += result;
    }

    return sum;
}
