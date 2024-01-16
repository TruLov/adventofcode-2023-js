export default function solve(input) {
    const [times, distances] = input
        .trim()
        .split('\n')
        .map((line) => line.match(/\d+/g));

    let prod = 1;

    // races
    for (let i = 0; i < times.length; i++) {
        const max_time = +times[i];
        const max_dist = +distances[i];

        const dist_vec = [];
        // each second
        for (let j = 0; j < max_time; j++) {
            dist_vec.push(calc_distance(j, max_time));
        }

        const wins = dist_vec.filter((x) => x > max_dist);
        const no_wins = wins.length;
        prod *= no_wins;
    }

    return prod;
}

function calc_distance(charging_time, max_time) {
    return (max_time - charging_time) * charging_time;
}
