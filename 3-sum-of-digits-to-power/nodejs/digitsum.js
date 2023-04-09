let digitSum = (cubes) => {
  let ds = (x) => {
    return x
      .toString()
      .split("")
      .reduce((sum, digit) => sum + cubes[digit], 0)
  }
  return ds
}

let memoizedMinNumber = (exp) => {
  let nineToTheExponent = 9 ** exp
  let minNumber = (d, maxD, e) => {
    if (maxD - 1 > nineToTheExponent * d) {
      return nineToTheExponent * d
    } else {
      return minNumber(d + 1, maxD * 10, e)
    }
  }
  return minNumber(2, 100, exp)
}

let findMatches = (min, exp) => {
  let max = memoizedMinNumber(exp)
  var matches = []
  let cubes = [...Array(10).keys()].map((x) => x ** exp)
  const ds = digitSum(cubes)
  for (i = min; i <= max; i += 10) {
    let baseSum = ds(i)
    var matchingSums = [...Array(10).keys()]
      .filter((x) => i + x == baseSum + cubes[x])
      .map((x) => i + x)
    if (matchingSums.length > 0) {
      matches = [...matches, ...matchingSums]
    }
  }
  return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5

let matches = findMatches(10, exp)
console.log(`${exp}: ${matches.join(", ")}`)
