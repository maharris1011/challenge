package main

import (
	"flag"
	"fmt"
	"math"
)

var cache [10]int64

func max_num(exponent int) int64 {
	digit := 2
	var max_digit_sum int64 = 11
	var maximum int64 = 10
	nine_to_the_exponent := math.Pow(9, float64(exponent))
	for maximum < max_digit_sum {
		maximum *= 10
		max_digit_sum = int64(math.Floor(nine_to_the_exponent)) * int64(digit)
		digit++
	}
	return max_digit_sum
}

func sum_digits(num int64, exponent int) int64 {
	remainder := num
	var sum_of_digits_to_power int64 = 0
	for remainder > 0 {
		digit := remainder % 10
		remainder = (remainder / 10)
		sum_of_digits_to_power += cache[digit]
	}
	return sum_of_digits_to_power
}

func find_matches(base_sum int64, i int64) {
	var j int64 = 0
	for j < 10 {
		num := j + i
		if num == (base_sum + cache[j]) {
			fmt.Printf("%d, ", num)
		}
		j++
	}
}

func matching_numbers(exponent int) {
	max := max_num(exponent)
	fmt.Printf("%d: ", max)
	// find matching numbers from 10..max
	var i int64 = 10
	for i < max {
		base_sum := sum_digits(i, exponent)
		find_matches(base_sum, i)
		i += 10
	}
}

func main() {

	expPtr := flag.Int("power", 5, "exponent to check sums for")
	flag.Parse()
	fmt.Printf("%d: ", *expPtr)

	i := 0
	for i < 10 {
		cache[i] = int64(math.Pow(float64(i), float64(*expPtr)))
		i++
	}
	matching_numbers(*expPtr)
	fmt.Println("done")
}
