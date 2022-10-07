namespace SumOfDigits
{
    public class DigitFinder
    {
        private int _exponent;
        private ulong[] _squares = new ulong[10];

        public DigitFinder(int exp)
        {
            _exponent = exp;

            for (int i = 0; i < 10; i++)
            {
                _squares[i] = (ulong)Convert.ToInt64(Math.Pow(i, exp));
            }
        }

        public ulong minNumber()
        {
            var digit = 2;
            ulong retval = 11;
            ulong maximum = 10;
            ulong nineToTheExponent = (ulong)Convert.ToInt64(Math.Pow(9, _exponent));
            while (maximum < retval)
            {
                maximum = maximum * 10;
                retval = nineToTheExponent * (ulong)digit;
                digit += 1;
            }
            return retval;
        }

        public ulong SumDigits(ulong num)
        {
            ulong retval = 0;
            ulong number = num;
            ulong remainder = num % 10;
            while (number != 0)
            {
                try
                {
                    retval += _squares[(number % 10)];
                    number = number / 10;
                }
                catch (IndexOutOfRangeException e)
                {
                    Console.WriteLine($"num % 10 = {num % 10}");
                    Console.WriteLine(e.Message);
                }
            }
            return retval;
        }


        public List<ulong> MatchingNumbers(ulong maxNum)
        {
            List<ulong> retval = new List<ulong>();
            for (ulong i = 10; i <= maxNum; i++)
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
            ulong minNum = df.minNumber();
            Console.Write(minNum + ": " + exponent + ": ");
            df.MatchingNumbers(minNum);
            Console.WriteLine("");
        }
    }
}