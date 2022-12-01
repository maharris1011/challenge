package main

import (
	"flag"
	"fmt"
	"math"
)

var cache [10]int64

func max_num(exponent int) int64 {
	var max_digit_sum int64 = int64(math.Pow(9, float64(exponent)))
	var maximum int64 = 10
	nine_to_the_exponent := math.Pow(9, float64(exponent))
	for digit := 2; maximum-1 < max_digit_sum; digit++ {
		maximum *= 10
		max_digit_sum = int64(math.Floor(nine_to_the_exponent)) * int64(digit)
	}
	return max_digit_sum
}

func sum_digits(num int64, exponent int) int64 {
	var sum_of_digits_to_power int64 = 0
	for remainder := num; remainder > 0; remainder /= 10 {
		sum_of_digits_to_power += cache[remainder%10]
	}
	return sum_of_digits_to_power
}

func find_matches(base_sum int64, i int64) []int64 {
	var nums []int64
	for j := 0; j < 10; j++ {
		if (int64(j) + i) == (base_sum + cache[j]) {
			nums = append(nums, (int64(j) + i))
		}
	}
	return nums
}

func matching_numbers(exponent int) {
	max := max_num(exponent)
	fmt.Printf("%d: ", max)

	// find matching numbers from 10..max
	for i := 10; int64(i) < max; i += 10 {
		base_sum := sum_digits(int64(i), exponent)
		nums := find_matches(base_sum, int64(i))
		for _, n := range nums {
			fmt.Printf("%d, ", n)
		}
	}
}

func main() {

	expPtr := flag.Int("power", 5, "exponent to check sums for")
	flag.Parse()
	fmt.Printf("%d: ", *expPtr)

	for i := 0; i < 10; i++ {
		cache[i] = int64(math.Pow(float64(i), float64(*expPtr)))
	}

	matching_numbers(*expPtr)
	fmt.Println("done")
}
