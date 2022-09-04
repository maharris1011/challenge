let digitSum = (x, n) => {
  return x
    .toString()
    .split("")
    .map((digit) => BigInt(digit ** n))
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

function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

//var matches = []
let minNum = minNumber(2, 5)
let matches = [...range(10, minNum)].filter((i) => digitSum(i, 5) === BigInt(i))

console.log(
  matches.join(" + ") +
    " = " +
    matches.reduce((sum, val) => BigInt(sum) + BigInt(val), 0)
)
