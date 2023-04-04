import Foundation

func pow(_ x: Int, _ y: Int) -> Int {
    return Int(pow(Double(x), Double(y)))
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

func sumDigits(num: Int64, table: [Int]) -> Int64 {
    var sum: Int64 = 0;
    var number = num;
    while (number > 0) {
        sum += Int64(table[Int(number % 10)]);
        number /= 10;
    }
    return sum;
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





