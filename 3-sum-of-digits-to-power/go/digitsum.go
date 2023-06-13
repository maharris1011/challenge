package main

import (
	"flag"
	"fmt"
	"math"
	"sync"
)

var cache [10]int64

func max_num(exponent float64) int64 {
	var max_digit_sum int64 = 9+9
	var maximum int64 = 10
	nine_to_the_exponent := math.Pow(9, exponent)
	for digit := 2; maximum-1 < max_digit_sum; digit++ {
		maximum *= 10
		max_digit_sum = int64(math.Floor(nine_to_the_exponent)) * int64(digit)
	}
	return max_digit_sum
}

func sum_digits(num int64, exponent float64) int64 {
	var sum_of_digits_to_power int64 = 0
	for remainder := num; remainder > 0; remainder /= 10 {
		sum_of_digits_to_power += cache[remainder%10]
	}
	return sum_of_digits_to_power
}

func find_matches_in_next_10(base_sum int64, base_num int64) []int64 {
	var nums []int64
	for j := 0; j < 10; j++ {
		if (int64(j) + base_num) == (base_sum + cache[j]) {
			nums = append(nums, (int64(j) + base_num))
		}
	}
	return nums
}

func matching_numbers_between(start int64, end int64, exponent float64, wg *sync.WaitGroup) {
	for i := start; i < end; i += int64(10) {
		base_sum := sum_digits(i, exponent)
		nums := find_matches_in_next_10(base_sum, int64(i))
		for _, n := range nums {
			fmt.Printf("%d, ", n)
		}
	}
	wg.Done()
}

func matching_numbers(exponent float64) {
	max := max_num(exponent)
	var wg = &sync.WaitGroup{}
	start := 10
	fmt.Printf("%d: .. %d: ", start, max)

	// find matching numbers from 10..max
	for i := int64(start); i < max+100_000; i += int64(100_000) {
		wg.Add(1)
		go matching_numbers_between(i, i+100_000, exponent, wg)
	}
	wg.Wait()
}

func main() {

	expPtr := flag.Int("power", 5, "exponent to check sums for")
	flag.Parse()
	fmt.Printf("%d: ", *expPtr)

	for i := 0; i < 10; i++ {
		cache[i] = int64(math.Pow(float64(i), float64(*expPtr)))
	}

	matching_numbers(float64(*expPtr))
	fmt.Println("done")
}
