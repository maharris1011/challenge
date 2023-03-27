let digitSum = (cubes) => {
  let ds = (x) => {
    return x
      .toString()
      .split("")
      .reduce((sum, digit) => BigInt(sum) + BigInt(cubes[digit]), 0)
  }
  return ds
}

let memoizedMinNumber = (exp) => {
  let nineToTheExponent = 9 ** exp
  let minNumber = (d, maxD, e) => {
    if (BigInt(maxD - 1) > BigInt(nineToTheExponent) * BigInt(d)) {
      return BigInt(nineToTheExponent) * BigInt(d)
    } else {
      return minNumber(d + 1, maxD * 10, e)
    }
  }
  return minNumber(2, 100, exp)
}

let findMatches = (min, max, exp) => {
  var matches = []
  let cubes = [...Array(10).keys()].map((x) => x ** exp)
  const ds = digitSum(cubes)
  for (i = BigInt(min); i <= max; i += BigInt(10)) {
    var baseSum = ds(i)
    for (var j = 0; j < 10; j++) {
      var num = BigInt(i) + BigInt(j)
      if (num === BigInt(baseSum + BigInt(cubes[j]))) {
        matches.push(num)
      }
    }
  }
  return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5

const minNumber = memoizedMinNumber(exp)
console.log(`minNumber = ${minNumber}`)
let matches = findMatches(10, minNumber, exp)
console.log(`${exp}: ${matches.join(", ")}`)
