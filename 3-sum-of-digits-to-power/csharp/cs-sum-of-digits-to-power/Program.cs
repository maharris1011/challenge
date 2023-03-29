namespace SumOfDigits
{
    public class DigitFinder
    {
        private int _exponent;
        private ulong _nineToTheExponent;

        private ulong[] _cache = new ulong[10];

        public DigitFinder(int exp)
        {
            _exponent = exp;
            _nineToTheExponent = (ulong)Convert.ToInt64(Math.Pow(9, _exponent));

            for (ulong i = 0; i < 10; i++)
            {
                _cache[i] = (ulong)Convert.ToInt64(Math.Pow(i, exp));
            }
        }

        public ulong minNumber()
        {
            var digit = 2;
            ulong maxDigitSum = _nineToTheExponent * (ulong)digit;
            ulong maximum = 10;
            while (maximum < maxDigitSum)
            {
                maximum = maximum * 10;
                maxDigitSum = _nineToTheExponent * (ulong)digit;
                digit += 1;
            }
            return maxDigitSum;
        }

        public ulong SumDigits(ulong num)
        {
            ulong digitSum = 0;
            ulong number = num;
            while (number != 0)
            {
                ulong digit = number % 10;
                number = number / 10;
                digitSum += _cache[digit];
            }
            return digitSum;
        }


        public void MatchingNumbers(ulong maxNum)
        {
            for (ulong i = 10; i <= (maxNum + 10); i += 10)
            {
                ulong base_sum = SumDigits(i);
                for (ulong j = 0; j < 10; j++)
                {
                    if ((i + j) == (base_sum + _cache[j]))
                    {
                        Console.Write($"{(i + j)}, ");
                    }
                }
            }
        }

        public IEnumerable<ulong> ProduceMatchingNumbers(ulong maxNum)
        {
            for (ulong i = 10; i <= (maxNum + 10); i += 10)
            {
                ulong base_sum = SumDigits(i);
                for (ulong j = 0; j < 10; j++)
                {
                    if ((i + j) == (base_sum + _cache[j]))
                    {
                        yield return (i + j);
                    }
                }
            }
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            var exponent = 5;
            if (args.Length > 0)
            {
                exponent = int.Parse(args[0]);
            }
            DigitFinder df = new DigitFinder(exponent);
            ulong minNum = df.minNumber();
            Console.Write(minNum + ": " + exponent + ": ");
            foreach (ulong num in df.ProduceMatchingNumbers(minNum))
            {
                Console.Write(num + ", ");
            }
            // df.MatchingNumbers(minNum);
            Console.WriteLine("");
        }
    }
}