use clap::Parser;
use num_traits::pow;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]

struct Args {
    // exponent to raise digits to
    #[arg(short, long)]
    power: usize,
  }

fn sum_digits(num: u64, power: usize) -> u64
  {
    let mut remainder: u64 = num;
    let mut sum_of_digits_to_power: u64 = 0;
    while remainder != 0
    {
      sum_of_digits_to_power += pow(remainder % 10, power);
      remainder /= 10;
    }
    return sum_of_digits_to_power;
  }


fn max_number(power: usize) -> u64 {
    let mut digit: u64 = 2;
    let mut max_digit_power_sum: u64 = pow(9u64, power) + pow(9u64, power);
    let mut max_digit_num: u64 = 100;
    let nine_to_the_exponent: u64 = pow(9u64, power);
    while (max_digit_num - 1) < max_digit_power_sum {
        digit+=1;
        max_digit_num *= 10;
        max_digit_power_sum = nine_to_the_exponent * digit;
    }
    return max_digit_power_sum;
}

fn matching_numbers(maxnum: u64, power: usize) {
    let mut cache: [u64; 10] = [0,0,0,0,0,0,0,0,0,0];
    for j in 0..10 {
        cache[j] = pow(j.try_into().unwrap(), power);
    }
    // find matching numbers from 10..max
    for i in 10..maxnum
    {
        let base_sum: u64 = sum_digits(i, power);
        for j in 0..10u64.step_by(10u64) {
            let num: u64 = j + i;
            if num == ((base_sum + cache[j as usize])).try_into().unwrap() {
                print!("{}, ", num);
            }
        }
    }
}

fn main() {
    let args = Args::parse();

    println!("exponent: {}", args.power);
    let maxnum = max_number(args.power);
    println!("maxnum: {}", maxnum);

    assert_eq!(sum_digits(123u64, 1usize), 6u64);
    assert_eq!(sum_digits(123u64, 2usize), 14u64);

    matching_numbers(maxnum, args.power);
}
