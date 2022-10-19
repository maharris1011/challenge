var squares = null
var nineToTheExponent = 0

let digitSum = (x, n) => {
  return x
    .toString()
    .split("")
    .reduce((sum, digit) => BigInt(sum) + BigInt(squares[digit]), 0)
}

let minNumber = (d, n) => {
  let maxNum = BigInt(nineToTheExponent * d)
  if (BigInt(10 ** d - 1) > maxNum) {
    return maxNum
  } else {
    return minNumber(d + 1, n)
  }
}

let findMatches = (min, max, exp) => {
  var matches = []
  for (var i = min; i <= max; i++) {
    if (digitSum(i, exp) === BigInt(i)) {
      matches.unshift(i)
    }
  }
  return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5
squares = [...Array(10).keys()].map((x) => x ** exp)
nineToTheExponent = 9 ** exp
let minNum = minNumber(2, exp)
let halfMin = minNum / BigInt(2)

let matches = findMatches(10, minNum, exp)
console.log(`${exp}: ${matches.join(", ")}`)
