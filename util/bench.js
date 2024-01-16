export function time_single(fn, ...args) {
    const start = performance.now();
    fn(...args);
    const end = performance.now();
    return end - start;
}

export function micro_bench(iterations, fn, ...args) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn(...args);
    }
    const end = performance.now();

    return (end - start) / iterations;
}

export function iqr_bench(iterations, fn, ...args) {
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        fn(...args);
        const end = performance.now();
        times.push([start, end]);
    }

    const sorted_seconds = times.map(([start, end]) => end - start).sort((a, b) => a - b);

    const q25 = quantile(sorted_seconds, 0.25);
    const q75 = quantile(sorted_seconds, 0.75);
    const iqr = q75 - q25;

    const lower = q25 - 1.5 * iqr;
    const upper = q75 + 1.5 * iqr;

    const cleaned_seconds = sorted_seconds.filter((s) => s >= lower && s <= upper);
    const avrg = cleaned_seconds.reduce((a, b) => a + b, 0) / cleaned_seconds.length;

    return avrg;
}

function quantile(sorted_array, perc) {
    const pos = (sorted_array.length - 1) * perc;
    const base = Math.floor((sorted_array.length - 1) * perc);
    const rest = pos - base;
    if (sorted_array[base + 1] !== undefined) {
        return sorted_array[base] + rest * (sorted_array[base + 1] - sorted_array[base]);
    } else {
        return sorted_array[base];
    }
}
