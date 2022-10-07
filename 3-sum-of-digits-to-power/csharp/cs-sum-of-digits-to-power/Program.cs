namespace SumOfDigits
{
    public class DigitFinder
    {
        private int _exponent;
        private int[] _squares = new int[10];

        public DigitFinder(int exp)
        {
            _exponent = exp;

            for (int i = 0; i < 10; i++)
            {
                _squares[i] = Convert.ToInt32(Math.Pow(i, exp));
            }
        }

        public long minNumber()
        {
            var digit = 2;
            long retval = 11;
            long maximum = 10;
            long nineToTheExponent = Convert.ToInt64(Math.Pow(9, _exponent));
            while (maximum < retval)
            {
                maximum = maximum * 10;
                retval = nineToTheExponent * digit;
                digit += 1;
            }
            return retval;
        }

        public long SumDigits(long num)
        {
            long retval = 0;
            long number = num;
            long remainder = num % 10;
            while (number != 0)
            {
                retval += _squares[(number % 10)];
                number = number / 10;
            }
            return retval;
        }


        public List<long> MatchingNumbers(long maxNum)
        {
            List<long> retval = new List<long>();
            for (int i = 10; i <= maxNum; i++)
            {
                if (i == SumDigits(i))
                {
                    Console.Write(i + ", ");
                    retval.Add(i);
                }
            }
            return retval;
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
            long minNum = df.minNumber();
            Console.Write(minNum + ": " + exponent + ": ");
            df.MatchingNumbers(minNum);
            Console.WriteLine("");
        }
    }
}