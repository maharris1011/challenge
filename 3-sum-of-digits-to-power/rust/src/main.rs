use clap::Parser;
use num_traits::pow;
use std::time::{Instant};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]

struct Args {
    // exponent to raise digits to
    #[arg(short, long)]
    power: usize,
  }

fn max_number(power: usize) -> u64 {
    let nine_to_the_exponent: u64 = pow(9u64, power);
    let mut digit: u64 = 2;
    let mut max_digit_power_sum: u64 = nine_to_the_exponent * digit;
    let mut max_digit_num: u64 = 100;
    while (max_digit_num - 1) < max_digit_power_sum {
        digit+=1;
        max_digit_num *= 10;
        max_digit_power_sum = nine_to_the_exponent * digit;
    }
    return max_digit_power_sum;
}

fn sum_of_digits_raised_to_power(n: u64, p: usize) -> u64 {
    n.to_string().chars().fold(0, |acc, c| {
        acc + c.to_digit(10).unwrap().pow(p.try_into().unwrap()) as u64
    })
}

fn find_numbers_with_sum_of_digits_raised_to_power(p: usize) -> Vec<u64> {
    (10..=max_number(p)).filter(|&n| {
        sum_of_digits_raised_to_power(n, p) == n
    }).collect()
}

fn main() {
    let args = Args::parse();

    println!("exponent: {}", args.power);
    let start = Instant::now();
    println!("{:?}", find_numbers_with_sum_of_digits_raised_to_power(args.power));
    let duration = start.elapsed().as_millis() as f64;
    println!("duration: {:?}", duration/1000.0);
}

