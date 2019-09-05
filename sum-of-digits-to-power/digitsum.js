
var digitSum = (x, n) => {
  return x.toString().split('').map((val) => {
    return Math.pow(val, n)
  }).reduce((sum, val) => {
    return sum + val
  }, 0)
}

var matches = []
for (var i = 2; i < 10000000; i++) {
  if (digitSum(i, 5) === i) {
    matches.push(i)
  }  
}

console.log(matches.join(' + ') + ' = ' + matches.filter((val) => {
  return val != null
}).reduce((sum, val) => {
  return sum+val
}, 0))