let digitSum = (exp) => {
  let squares = [...Array(10).keys()].map((x) => x ** exp)

  let ds = (x) => {
    return x
      .toString()
      .split("")
      .reduce((sum, digit) => BigInt(sum) + BigInt(squares[digit]), 0)
  }
  return ds
}

let memoizedMinNumber = (exp) => {
  let nineToTheExponent = 9 ** exp
  let digits = [2, 3, 4, 5, 6, 7, 8, 9]
  let digitsToTen = [
    100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000
  ]
  let minNumber = () => {
    let arr = digits.map((x) => [
      BigInt(digitsToTen[x - 2]) - BigInt(1),
      BigInt(nineToTheExponent * x)
    ])
    let firstPair = arr.filter((val) => val[0] > val[1])
    return firstPair[0][1]
  }
  return minNumber
}

let findMatches = (min, max, exp) => {
  var matches = []
  let squares = [...Array(10).keys()].map((x) => x ** exp)
  const ds = digitSum(exp)
  var i = BigInt(10)
  for (i = i; i <= max; i += BigInt(10)) {
    var baseSum = ds(i)
    for (var j = 0; j < 10; j++) {
      var num = BigInt(i) + BigInt(j)
      if (num === BigInt(baseSum + BigInt(squares[j]))) {
        matches.unshift(num)
      }
    }
  }
  return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5

const minNumber = memoizedMinNumber(exp)
let minNum = minNumber(10, 2)
console.log(`minNum = ${minNum}`)
let matches = findMatches(10, minNum, exp)
console.log(`${exp}: ${matches.join(", ")}`)
