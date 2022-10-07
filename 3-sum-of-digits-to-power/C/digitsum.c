#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define NUM_DIGITS 19

int digits_to_power[9];
unsigned long sum_equal_num[20];

unsigned long max_num(int exponent)
{
  int digit = 2;
  unsigned long retval = 11;
  unsigned long maximum = 10;
  unsigned long nine_to_the_exponent = pow(9, exponent);
  while (maximum < retval)
  {
    maximum *= 10;
    retval = nine_to_the_exponent * digit++;
  }
  return retval;
}

unsigned long sum_digits(unsigned long num, int exponent)
{
  unsigned long retval = 0;
  unsigned long full_num = num;
  while (full_num != 0)
  {
    retval += digits_to_power[(full_num % 10)];
    full_num /= 10;
  }
  return retval;
}

unsigned long *matching_numbers(int exponent)
{
  unsigned long max = max_num(exponent);
  for (unsigned long i = 10; i < max; i++)
  {
    if (i == sum_digits(i, exponent))
    {
      printf("%ld, ", i);
    }
  }
  return sum_equal_num;
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
  for (int i = 0; i <= 9; i++)
  {
    digits_to_power[i] = pow(i, exponent);
  }
  printf("%d: ", exponent);
  matching_numbers(exponent);
  printf("\n");
  return 0;
}