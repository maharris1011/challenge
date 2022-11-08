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


let candidates = 10...minNumber(exp: exponent);
let matchingNumbers = candidates.filter({sumDigits(num: $0) == Decimal($0)});
print("\(matchingNumbers)");

func minNumber(exp: Int) -> Int64 {
    var digit: Int = 2;
    var retval: Int64 = 11;
    var maximum: Int64 = 10;
    let nineToTheExp = Int64(pow(9.0, Double(exponent)));
    while ((maximum - 1) < retval)
    {
        maximum *= Int64(10);
        retval = nineToTheExp * Int64(digit);
        digit += 1;
    }
    return retval;
}

func numToListOfDigitsLoop(num: Int64) -> [Int64]
{
    var number = num;
    var digits: [Int64] = [];
    while (number != 0) {
        digits.append(number % 10);
        number /= 10;
    }
    return digits;
}

func numToListOfDigitsRec(num: Int64) -> [Int64]
{
    (num < 10) ? [num] : [num % 10] + numToListOfDigitsRec(num: num / 10);
}


func sumDigits(num: Int64) -> Decimal {
    let digitsPowerTable = ([0,1,2,3,4,5,6,7,8,9].map { num in
        return pow(Decimal(num), exponent);
    })
    return numToListOfDigitsLoop(num: num).reduce(0, {x, y in x + digitsPowerTable[Int(y)]});
}

