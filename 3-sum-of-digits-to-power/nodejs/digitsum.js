let digitSum = (cubes) => {
    let ds = (x) => {
        return x
            .toString()
            .split("")
            .reduce((sum, digit) => (sum) + (cubes[digit]), 0)
    }
    return ds
}

let memoizedMinNumber = (exp) => {
    let nineToTheExponent = 9 ** exp
    let minNumber = (d, maxD, e) => {
        if ((maxD - 1) > (nineToTheExponent) * (d)) {
            return (nineToTheExponent) * (d)
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
    for (i = (min); i <= max; i += (10)) {
        var baseSum = ds(i)
        for (var j = 0; j < 10; j++) {
            var num = (i) + (j)
            if (num === ((baseSum) + (cubes[j]))) {
                matches.push(num)
            }
        }
    }
    return matches
}

const myArgs = process.argv.slice(2)

let exp = myArgs[0] || 5

let matches = findMatches(10, exp)
console.log(`${exp}: ${matches.join(", ")}`)