#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <limits.h>

unsigned long cache[10];

unsigned long max_num(int exponent) {
  int digit = 2;
  unsigned long nine_to_the_exponent = pow(9, exponent);
  unsigned long max_digit_sum = nine_to_the_exponent * digit;
  unsigned long maximum = pow(10, digit);
  while (maximum - 1 < max_digit_sum) {
    maximum *= 10;
    digit++;
    max_digit_sum = nine_to_the_exponent * digit;
  }
  return max_digit_sum;
}

unsigned long sum_digits(unsigned long num, int exponent) {
  unsigned long sum = 0;
  for (; num != 0; num /= 10) {
    sum += cache[num % 10];
  }
  return sum;
}

void matching_numbers(int exponent) {
  unsigned long max = max_num(exponent);
  unsigned long step = 10;
  for (int j = 0; j < step; j++) {
    cache[j] = pow(j, exponent);
  }
  
  // find matching numbers from 10..max
  for (unsigned long i = 10; i < (max + step); i += step) {
    unsigned long base_sum = sum_digits(i, exponent);
    for (unsigned long j = 0; j < step; j++) {
      if (j + i == (base_sum + cache[j])) {
        printf("%ld, ", j + i);
      }
    }
  }
  printf("\n");
}

int parse_args(int argc, char **argv) {
  int retval = 5;
  if (argc > 1) {
    retval = atoi(argv[1]);
  }
  return retval;
}

int main(int argc, char **argv) {
  int exponent = parse_args(argc, argv);
  printf("%d: ", exponent);
  matching_numbers(exponent);
  return 0;
}
