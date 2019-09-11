
var digitSum = (x, n) => {
  return x.toString().split('').map((val) => {
    return BigInt(val ** n)
  }).reduce((sum, val) => {
    return BigInt(sum) + BigInt(val)
  }, 0)
}

var matches = []
for (var i = 10n; i < 2n**32n; i++) {
  if (digitSum(i, 5) === i) {
    matches.push(i)
  }  
}

console.log(matches.join(' + ') + ' = ' + matches.reduce((sum, val) => {
  return BigInt(sum)+BigInt(val)
}, 0))
