let memoizedDigitSum = (exp) => {
  let cache = {}
  let squares = [...Array(10).keys()].map((x) => x ** exp)

  let digitSum = (x) => {
    if (x == 0) return 0
    if (x == 1) return 1
    arr = x.toString().split("").sort()
    str = arr.join()
    if (str in cache) {
      return cache[str]
    }
    cache[str] = cache[arr.pop()] + digitSum(arr.join())
    return cache[x]
  }

  return digitSum
}

let digitSum = (exp) => {
  squares = [...Array(10).keys()].map((x) => x ** exp)

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

  let minNumber = (d) => {
    let maxNum = BigInt(nineToTheExponent * d)
    if (BigInt(10 ** d - 1) > maxNum) {
      return maxNum
    } else {
      return minNumber(d + 1)
    }
  }

  return minNumber
}

let findMatches = (min, max, exp) => {
  var matches = []
  const ds = memoizedDigitSum(exp)
  for (var i = min; i <= max; i++) {
    if (ds(i) === BigInt(i)) {
      matches.unshift(i)
    }
  }
  return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5

const minNumber = memoizedMinNumber(exp)
let minNum = minNumber(2)
let matches = findMatches(10, minNum, exp)
console.log(`${exp}: ${matches.join(", ")}`)
