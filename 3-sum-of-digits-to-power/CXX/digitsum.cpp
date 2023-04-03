#include <iostream>
#include <cmath>
using namespace std;

#define ULONG unsigned long

class NarcissisticNumbersFinder
{
private:
  ULONG _cache[10];
  ULONG _results[10];
  int _p;
  int _size;

public:
  NarcissisticNumbersFinder()
  {
    _p = 5;
    _size = 0;
    for (int i = 0; i < 10; i++)
    {
      _cache[i] = pow(i, _p);
    }
  }

  NarcissisticNumbersFinder(int p)
  {
    _p = p;
    _size = 0;
    for (int i = 0; i < 10; i++)
    {
      _cache[i] = pow(i, _p);
    }
  }

  ULONG sum_of_digits_raised_to_power(int n)
  {
    ULONG sum = 0;
    for (; n > 0; n /= 10)
    {
      sum += _cache[n % 10];
    }
    return sum;
  }

  ULONG upper_bound()
  {
    int d = 2;
    ULONG nine_to_p = pow(9, _p);
    ULONG max_n_digit = 100;
    while (max_n_digit - 1 < nine_to_p * d)
    {
      max_n_digit *= 10;
      d++;
    }
    return nine_to_p * d;
  }

  int find_numbers()
  {
    for (int n = 10; n <= upper_bound(); n++)
    {
      if (sum_of_digits_raised_to_power(n) == n)
      {
        _results[_size++] = n;
      }
    }
    return _size;
  }

  int get_size()
  {
    return _size;
  }

  ULONG num_at(int i)
  {
    return _results[i];
  }
};

int main(int argc, char *argv[])
{
  int p = 5;

  if (argc > 1)
  {
    p = stoi(argv[1]);
  }

  NarcissisticNumbersFinder nf(p);

  int size = nf.find_numbers();

  cout << p << ": ";
  for (int i = 0; i < size; i++)
  {
    cout << nf.num_at(i) << ", ";
  }
  cout << endl;
  return 0;
}
