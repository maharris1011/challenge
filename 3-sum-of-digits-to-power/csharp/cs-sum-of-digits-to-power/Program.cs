namespace SumOfDigits
{
    public class DigitFinder
    {
        private int _exponent;
        public DigitFinder(int exp)
        {
            _exponent = exp;
        }

        public long minNumber()
        {
            var digit = 1;
            long retval;
            long maximum;
            do
            {
                digit++;
                maximum = Convert.ToInt64(Math.Pow(10, digit)) - 1;
                retval = Convert.ToInt64(Math.Pow(9, _exponent)) * digit;
            } while (maximum < retval);
            return retval;
        }

        public List<long> ListOfDigits(long num)
        {
            List<long> retval = new List<long>();
            long lastDigit = num % 10;
            long remainder = num / 10;
            while (remainder > 0)
            {
                retval.Add(lastDigit);
                lastDigit = remainder % 10;
                remainder = remainder / 10;
            }
            retval.Add(lastDigit);
            return retval;
        }
        public long SumDigits(long num)
        {
            List<long> digits = ListOfDigits(num);
            return digits.Aggregate(Convert.ToInt64(0), (acc, x) => acc + Convert.ToInt64(Math.Pow(x, _exponent)));
        }

        public List<long> MatchingNumbers(long maxNum)
        {
            List<long> retval = new List<long>();
            for (int i = 10; i <= maxNum; i++)
            {
                if (i == SumDigits(i))
                {
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
            Console.WriteLine(String.Join(", ", df.MatchingNumbers(minNum)));
        }
    }
}