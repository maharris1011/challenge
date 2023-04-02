
def maxNumberSearch(e)
  d = 2
  while ((10 ** d) - 1 < (9 ** e) * d) 
    d = d + 1
  end
  return (9 ** e) * d
end

def digitsum(n,e)
  return n.to_s.split("")
    .map { |d| d.to_i ** e }
    .reduce { |acc, i| i + acc }
end

ARGV.each do |power|
  e = power.to_i
  rg = (10..maxNumberSearch(e)).step(10).map { |num|
    baseSum = digitsum(num,e)
    matching = (0..9).map { |i|
      [num + i, baseSum + i ** e]
    }
    .select { |num, sum| num == sum }
    .collect { |arr| arr.first }

    matching
  }
  .select {|arr| arr.empty? == false}
  .flatten

  printf "#{e}: #{rg}\n"
end
