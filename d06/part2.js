export default function solve(input) {
    const [time, max_dist] = input
        .split('\n')
        .map((line) => line.match(/\d+/g).join().replaceAll(',', ''));

    let firstWin, lastWin;
    for (let i = 1; i < time; i++) {
        if (calc_distance(i, time) > max_dist) {
            firstWin = i;
            console.log(`${firstWin}`);
            break;
        }
    }
    for (let i = time - 1; i > 1; i--) {
        if (calc_distance(i, time) > max_dist) {
            lastWin = i;
            console.log(`${lastWin}`);
            break;
        }
    }

    const diff = lastWin - firstWin;

    return diff + 1;
}

function calc_distance(charging_time, max_time) {
    return (max_time - charging_time) * charging_time;
}
