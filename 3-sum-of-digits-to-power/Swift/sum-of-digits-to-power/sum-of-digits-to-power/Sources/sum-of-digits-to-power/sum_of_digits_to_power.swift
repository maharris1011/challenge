import Foundation

@inlinable
func intPow(_ base: Int, _ exp: Int) -> Int {
    var result = 1
    var b = base
    var e = exp
    while e > 0 {
        if e & 1 == 1 { result *= b }
        b *= b
        e >>= 1
    }
    return result
}

@inlinable
func maxCandidate(exp: Int) -> Int64 {
    let nineToExp = intPow(9, exp)
    var digit = 2
    var retval = Int64(nineToExp * digit)
    var maximum: Int64 = 100
    while (maximum - 1) < retval {
        retval = Int64(nineToExp * digit)
        maximum *= 10
        digit += 1
    }
    return retval
}

@inlinable
func sumDigits(num: Int64, table: [Int]) -> Int64 {
    var sum: Int64 = 0
    var n = num
    while n > 0 {
        sum += Int64(table[Int(n % 10)])
        n /= 10
    }
    return sum
}

@main
public struct sum_of_digits_to_power {
    public static func main() {
        var exponent = 5
        if CommandLine.arguments.count > 1 {
            exponent = Int(atoi(CommandLine.arguments[1]))
        }
        let table = (0...9).map { intPow($0, exponent) }
        let maxNum = maxCandidate(exp: exponent)
        var results: [String] = []

        var i: Int64 = 10
        while i <= maxNum {
            let baseSum = sumDigits(num: i, table: table)
            for j in 0..<10 {
                let candidate = i + Int64(j)
                if candidate >= 10 && candidate <= maxNum && candidate == baseSum + Int64(table[j]) {
                    results.append("\(candidate)")
                }
            }
            i += 10
        }

        print("\(exponent): [\(results.joined(separator: ", "))]")
    }
}





