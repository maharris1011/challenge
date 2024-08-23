package main

import (
	"flag"
	"fmt"
	"math"
	"sync"
)

var cache [10]int64

func max_num(exponent float64) int64 {
	var max_digit_sum int64 = 9 + 9
	var maximum int64 = 10
	nine_to_the_exponent := int64(math.Floor(math.Pow(9, exponent)))
	var digit int64 = 2
	for ; maximum-1 < max_digit_sum; digit++ {
		maximum *= 10
		max_digit_sum = nine_to_the_exponent * digit
	}
	return max_digit_sum
}

func sum_digits(num int64) int64 {
	var sum_of_digits_to_power int64 = 0
	for remainder := num; remainder > 0; remainder /= 10 {
		sum_of_digits_to_power += cache[remainder%10]
	}
	return sum_of_digits_to_power
}

func find_matches_in_next_10(base_sum int64, base_num int64) []int64 {
	var nums []int64
	var i int64 = 0
	for ; i < 10; i++ {
		if (base_num + i) == (base_sum + cache[i]) {
			nums = append(nums, (i + base_num))
		}
	}
	return nums
}

func matching_numbers_between(start int64, end int64, _ float64, wg *sync.WaitGroup) {
	for i := start; i < end; i += int64(10) {
		base_sum := sum_digits(i)
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
	var start int64 = 10
	fmt.Printf("start: %d .. max: %d: ", start, max)

	// find matching numbers from 10..max
	// assign each working group a disjoint set of consecutive numbers to search
	var i int64 = start
	const increment int64 = 1_000_000
	for ; i < max+increment; i += increment {
		wg.Add(1)
		go matching_numbers_between(i, i+increment, exponent, wg)
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
