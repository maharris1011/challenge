//
//  main.swift
//  sum-of-digits-to-power
//
//  Created by Mark Harris on 9/8/22.
//

import Foundation

var exponent: Int = 5;

if (CommandLine.arguments.count > 1) {
    print("\(CommandLine.arguments.count)");
    exponent = Int(atoi(CommandLine.arguments[1]));
}

let digits = [0,1,2,3,4,5,6,7,8,9];
let digitsPowerTable = (digits.map { num in
    return pow(Decimal(num), exponent);
})

let candidates = 10...minNumber(exp: exponent);
let matchingNumbers = candidates.filter({sumDigits(num: $0) == Decimal($0)});
print("\(matchingNumbers)");

func minNumber(exp: Int) -> Int64 {
    var digit: Int = 2;
    var retval: Int64 = 1;
    var maximum: Int64 = 0;
    while (maximum < retval)
    {
        maximum = Int64(pow(10.0, Double(digit))) - 1;
        retval = Int64(pow(9.0, Double(exponent))) * Int64(digit);
        digit+=1;
    }
    return retval;
}

func numToListOfDigitsLoop(num: Int64) -> [Int64]
{
    var number = num;
    var retval = [Int64](repeating: 0, count: 19); // max size of 64-bit int
    var i = 0;
    while (number != 0) {
        retval[i] = number % 10;
        number /= 10;
        i += 1;
    }
    return retval;
}

func numToListOfDigitsRec(num: Int64) -> [Int64]
{
    (num < 10) ? [num] : [num % 10] + numToListOfDigitsRec(num: num / 10);
}

func sumDigits(num: Int64) -> Decimal {
    return numToListOfDigitsLoop(num: num).reduce(0, {x, y in x + digitsPowerTable[Int(y)]});
}

