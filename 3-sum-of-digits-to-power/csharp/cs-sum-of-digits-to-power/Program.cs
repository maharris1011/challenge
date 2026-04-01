using System.Runtime.CompilerServices;
using System.Text;

namespace SumOfDigits
{
    public class DigitFinder
    {
        private readonly int _exponent;
        private readonly ulong _nineToTheExponent;
        private readonly ulong[] _cache = new ulong[10];

        public DigitFinder(int exp)
        {
            _exponent = exp;
            _nineToTheExponent = (ulong)Math.Pow(9, exp);
            for (ulong i = 0; i < 10; i++)
                _cache[i] = (ulong)Math.Pow((double)i, exp);
        }

        public ulong MaxNumber()
        {
            var digit = 2;
            ulong maxDigitSum = _nineToTheExponent * (ulong)digit;
            for (ulong maximum = 100; maximum - 1 < maxDigitSum; digit++, maximum *= 10)
                maxDigitSum = _nineToTheExponent * (ulong)digit;
            return maxDigitSum;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ulong SumDigits(ulong num)
        {
            ulong digitSum = 0;
            for (ulong number = num; number != 0; number /= 10)
                digitSum += _cache[number % 10];
            return digitSum;
        }

        public void PrintMatches(StringBuilder sb)
        {
            ulong maxNum = MaxNumber();
            for (ulong i = 10; i <= (maxNum + 10); i += 10)
            {
                ulong base_sum = SumDigits(i);
                for (ulong j = 0; j < 10; j++)
                {
                    if ((i + j) == (base_sum + _cache[j]))
                        sb.Append(i + j).Append(", ");
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
                exponent = int.Parse(args[0]);
            DigitFinder df = new DigitFinder(exponent);
            var sb = new StringBuilder();
            sb.Append(exponent).Append(": ");
            df.PrintMatches(sb);
            sb.AppendLine();
            Console.Write(sb.ToString());
        }
    }
}
