use clap::Parser;
use rayon::prelude::*;
use std::time::Instant;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short, long)]
    power: usize,
}

fn max_number(power: usize) -> u64 {
    let nine_to_the_exponent = 9u64.pow(power as u32);
    let mut digit: u64 = 2;
    let mut max_digit_num: u64 = 100;
    loop {
        let max_digit_power_sum = nine_to_the_exponent * digit;
        if (max_digit_num - 1) >= max_digit_power_sum {
            return max_digit_power_sum;
        }
        digit += 1;
        max_digit_num *= 10;
    }
}

fn digit_sum(mut n: u64, cache: &[u64; 10]) -> u64 {
    let mut sum = 0u64;
    while n > 0 {
        sum += cache[(n % 10) as usize];
        n /= 10;
    }
    sum
}

fn find_narcissistic(p: usize) -> Vec<u64> {
    let max = max_number(p);
    let cache: [u64; 10] = std::array::from_fn(|d| (d as u64).pow(p as u32));

    if p >= 7 {
        let mut results: Vec<u64> = (10u64..=max)
            .into_par_iter()
            .filter(|&n| digit_sum(n, &cache) == n)
            .collect();
        results.sort_unstable();
        results
    } else {
        (10u64..=max)
            .filter(|&n| digit_sum(n, &cache) == n)
            .collect()
    }
}

fn main() {
    let args = Args::parse();
    println!("exponent: {}", args.power);
    let start = Instant::now();
    println!("{:?}", find_narcissistic(args.power));
    let duration = start.elapsed().as_millis() as f64;
    println!("duration: {:?}", duration / 1000.0);
}

