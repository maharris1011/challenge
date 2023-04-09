def maxNumberSearch(e)
  d = 2
  while ((10 ** d) - 1 < (9 ** e) * d)
    d = d + 1
  end
  return (9 ** e) * d
end

def digitsum(n, e)
  sum = 0
  while n != 0
    sum = sum + e[(n % 10)]
    n = n / 10
  end
  return sum
end

def find_in_10(num, e)
  baseSum = digitsum(num, e)
  return (0..9).select { |i|
           (num + i) == (baseSum + e[i])
         }
           .map { |match|
           num + match
         }
end

ARGV.each do |power|
  e = power.to_i
  exps = (0..9).map { |i| i ** e }
  rg = (10..maxNumberSearch(e)).step(10).map { |num|
    find_in_10(num, exps)
  }.flatten
  printf "#{e}: #{rg}\n"
end
