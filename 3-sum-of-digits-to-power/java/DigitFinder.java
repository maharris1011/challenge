import java.lang.Math;

public class DigitFinder {

    private long _nineToTheExponent;
    private int[] _cache = {0,1,2,3,4,5,6,7,8,9};

    public DigitFinder()
    {
        _nineToTheExponent = (long) Math.pow(9, 5);
        for(var i = 0; i < 10; i++) {
            _cache[i] = (int)Math.pow(i, 5);
        }
    }

    public DigitFinder(int exp)
    {
        _nineToTheExponent = (long) Math.pow(9, exp);
        for(var i = 0; i < 10; i++) {
            _cache[i] = (int)Math.pow(i, exp);
        }
    }

    public long minNumber()
    {
        var digit = 2;
        long maxDigitSum = _nineToTheExponent * (long)digit;
        long maximum = 10;
        while (maximum < maxDigitSum)
        {
            maximum = maximum * 10;
            maxDigitSum = _nineToTheExponent * (long)digit;
            digit += 1;
        }
        return maxDigitSum;
    }

    public long sumDigits(long num)
    {
        long digitSum = 0;
        long number = num;
        while (number != 0) {
            int digit = (int) (number % 10);
            digitSum += _cache[digit];
            number = number / 10;
        }
        return digitSum;
    }

    public void matchingNumbers(long maxNum)
    {
        for (long i = 10; i <= (maxNum + 10); i += 10)
        {
            long base_sum = sumDigits(i);
            for (int j = 0; j < 10; j++)
            {
                if ((i + j) == (base_sum + _cache[j]))
                {
                    System.out.print((i + j) + ", ");
                }
            }
        }
        System.out.println();
    }
}
