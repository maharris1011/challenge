var squares = null

let digitSum = (x, n) => {
  return x
    .toString()
    .split("")
    .map((digit) => BigInt(squares[digit]))
    .reduce((sum, val) => BigInt(sum) + BigInt(val), 0)
}

let minNumber = (d, n) => {
  let maxNum = BigInt(9 ** n * d)
  if (BigInt(10 ** d - 1) > maxNum) {
    return maxNum
  } else {
    return minNumber(d + 1, n)
  }
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5
squares = [...Array(10).keys()].map((x) => x ** exp)
var matches = []
let minNum = minNumber(2, exp)

for (var i = 10; i <= minNum; i++) {
  if (digitSum(i, exp) === BigInt(i)) {
    matches.unshift(i)
  }
}

console.log(matches.join(", "))
