#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <limits.h>

unsigned long digits_to_power[9];
unsigned long cache[99999999999];

unsigned long max_num(int exponent)
{
  int digit = 2;
  unsigned long max_digit_sum = 11;
  unsigned long maximum = 10;
  unsigned long nine_to_the_exponent = pow(9, exponent);
  while (maximum < max_digit_sum)
  {
    maximum *= 10;
    max_digit_sum = nine_to_the_exponent * digit;
    digit++;
  }
  return max_digit_sum;
}

unsigned long sum_digits(unsigned long num, int exponent)
{
  if (num < 10)
  {
    cache[num] = pow(num, exponent);
    return cache[num];
  }
  unsigned long remainder = num;
  unsigned long sum_of_digits_to_power = 0;
  while (remainder != 0 && cache[remainder] == 0)
  {
    unsigned long digit = remainder % 10;
    remainder /= 10;
    cache[digit] = (cache[digit] == 0) ? pow(digit, exponent) : cache[digit];
    sum_of_digits_to_power += cache[digit];
  }
  cache[num] = cache[remainder] + sum_of_digits_to_power;
  return cache[num];
}

void matching_numbers(int exponent)
{
  unsigned long max = max_num(exponent);
  unsigned long step = 10000;
  for (unsigned long j = 0; j < step; j++)
  {
    cache[j] = sum_digits(j, exponent);
  }
  // find matching numbers from 10..max
  for (unsigned long i = step; i < max; i += step)
  {
    unsigned long base_sum = sum_digits(i, exponent);
    for (unsigned long j = 1; j < step; j++)
    {
      if ((j + i) == base_sum + cache[j])
      {
        printf("%ld, ", (j + i));
      }
    }
  }
}

int parse_args(int argc, char **argv)
{
  int retval = 5;
  if (argc > 1)
  {
    retval = atoi(argv[1]);
  }
  return retval;
}

int main(int argc, char **argv)
{
  int exponent = parse_args(argc, argv);
  printf("%d: ", exponent);
  matching_numbers(exponent);
  printf("\n");
  return 0;
}