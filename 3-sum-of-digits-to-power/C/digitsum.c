#include <stdio.h>
#include <stdlib.h>
#include <math.h>

long max_num(int exponent)
{
  int digit = 2;
  while (1)
  {
    long largestDigitSum = pow(9, exponent) * digit;
    long largestXDigitNumber = pow(10, digit) - 1;
    if (largestXDigitNumber > largestDigitSum)
    {
      return largestDigitSum;
    }
    else
    {
      digit++;
    }
  }
}

int *list_of_digits(long num)
{
  int num_digits = floor(log10(num)) + 1;
  int *retval = malloc(num_digits * sizeof(int));
  int index = 0;
  long lastDigit = num % 10;
  long remainder = num / 10;
  while (remainder > 0)
  {
    retval[index++] = lastDigit;
    lastDigit = remainder % 10;
    remainder = remainder / 10;
  }
  retval[index++] = lastDigit;
  return retval;
}

long sum_digits(long num, int exponent)
{
  int *digits = list_of_digits(num);
  int num_of_digits = floor(log10(num)) + 1;
  long retval = 0;
  for (int i = 0; i < num_of_digits; i++)
  {
    retval += pow(digits[i], exponent);
  }
  free(digits);
  return retval;
}

long *matching_numbers(int exponent)
{
  long *sumEqualNum = malloc(50 * sizeof(long));
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

int main(int argc, char **argv)
{
  int exponent = 5;
  if (argc > 1)
  {
    exponent = atoi(argv[1]);
  }
  long *rgMatchingNumbers = matching_numbers(exponent);
  for (int i = 0; rgMatchingNumbers[i] != 0; i++)
  {
    printf("%lu, ", rgMatchingNumbers[i]);
  }
  printf("\n");
  return 0;
}