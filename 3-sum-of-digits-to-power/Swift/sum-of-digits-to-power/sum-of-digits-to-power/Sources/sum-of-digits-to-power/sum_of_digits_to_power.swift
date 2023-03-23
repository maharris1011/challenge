import Foundation

func pow(_ x: Int, _ y: Int) -> Int {
  var result = 1
  for _ in 0..<y {
    result *= x
  }
  return result
}

func minNumber(exp: Int) -> Int64 {
    let nineToTheExp = pow(9, exp)
    var digit: Int = 2;
    var retval: Int64 = Int64(nineToTheExp * digit);
    var maximum: Int64 = 100;
    while ((maximum - 1) < retval)
    {
        retval = Int64(nineToTheExp * digit);
        maximum *= Int64(10);
        digit += 1;
    }
    return retval;
}

func numToListOfDigitsLoop(num: Int64) -> [Int]
{
    var number = num;
    var digits: [Int64] = [];
    while (number != 0) {
        digits.append(number % 10);
        number /= 10;
    }
    return digits;
}

func sumDigits(num: Int64, table: [Int]) -> Int64 {
    return Int64(numToListOfDigitsLoop(num: num)
                    .reduce(0, {x, y in x + table[Int(y)]}));
}

@main
public struct sum_of_digits_to_power {
    public static func main() {
        var exponent = 5;
        if (CommandLine.arguments.count > 1) {
            exponent = Int(atoi(CommandLine.arguments[1]));
        }
        let digitsPowerTable = ([0,1,2,3,4,5,6,7,8,9].map { num in
            return pow(num, exponent);
        });
        let candidates = 10...minNumber(exp: exponent);
        let matchingNumbers = candidates.filter({sumDigits(num: $0, table: digitsPowerTable) == $0});
        print("\(exponent): \(matchingNumbers)");
    }
}





