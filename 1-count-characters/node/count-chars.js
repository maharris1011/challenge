let count_chars = (ch, str) => {
  if (str == null) {
    return 0
  }
  if (str == "") {
    return 0
  }
  if (ch == "" || ch == null) {
    return 0
  }
  let ct = ch == str.charAt(0) ? 1 : 0
  return ct + count_chars(ch, str.substr(1))
}

let assert = (expr, str) => {
  if (expr == false) {
    console.log(`false: ${str}`)
  } else {
    console.log(`${str}`)
  }
}

assert(count_chars("a", "a") == 1, "count a in a = 1")
assert(count_chars("c", "a") == 0, "count of 'c' in 'a' = 0")
assert(count_chars("a", "ab") == 1, "count of 'a' in 'ab' = 1")
assert(count_chars("a", "aca") == 2, "count of 'a' in 'aca' = 2")
assert(count_chars("a", "bbb") == 0, "count of 'a' in 'bbb' is 0")
assert(count_chars("b", "bbb") == 3, "count of 'b' in 'bbb' is 3")
assert(count_chars("a", "bbaaabb") == 3, "count of 'a' in 'bbaaabb' is 3")
assert(count_chars("a", null) == 0, "count of anything in null = 0")
assert(count_chars("a", "") == 0, "count of empty string is 0")
assert(count_chars("", "abc") == 0, "count of nothing in anything is 0")
