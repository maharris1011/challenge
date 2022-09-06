#include <stdio.h>
#include <stdlib.h>
#include <math.h>

long max_num(int exponent)
{
  int digit = 2;
  long retval;
  long maximum;
  do
  {
    maximum = pow(10, digit) - 1;
    retval = pow(9, exponent) * digit;
    digit++;
  } while (maximum > retval);
  return pow(9, exponent) * (digit + 1);
}

int num_of_digits(long num)
{
  return floor(log10(num)) + 1;
}

int *list_of_digits(long num)
{
  int num_digits = num_of_digits(num);
  int *retval = malloc(num_digits * sizeof(int));
  int index = 0;
  for (int i = 0; i < num_digits; i++)
  {
    retval[i] = num % 10;
    num = num / 10;
  }
  return retval;
}

long sum_digits(long num, int exponent)
{
  int *digits = list_of_digits(num);
  int num_digits = num_of_digits(num);
  long retval = 0;
  for (int i = 0; i < num_digits; i++)
  {
    retval += pow(digits[i], exponent);
  }
  free(digits);
  return retval;
}

long *matching_numbers(int exponent)
{
  long *sumEqualNum = malloc(20 * sizeof(long));
  long max = max_num(exponent);
  int idx = 0;
  for (long i = 10; i < max; i++)
  {
    if (i == sum_digits(i, exponent))
    {
      sumEqualNum[idx++] = i;
    }
  }
  sumEqualNum[idx] = 0;
  return sumEqualNum;
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
  long *rgMatchingNumbers = matching_numbers(exponent);
  for (int i = 0; rgMatchingNumbers[i] != 0; i++)
  {
    printf("%lu, ", rgMatchingNumbers[i]);
  }
  printf("\n");
  return 0;
}