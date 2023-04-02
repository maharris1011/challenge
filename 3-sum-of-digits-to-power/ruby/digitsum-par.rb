require 'benchmark'

def maxNumberSearch(e)
  d = 2
  while ((10 ** d) - 1 < (9 ** e) * d) 
    d = d + 1
  end
  return (9 ** e) * d
end

def digitsum(n,e)
  sum = 0
  while n != 0 do
    sum = sum + e[(n % 10)]
    n = n / 10
  end
  return sum
end

def find_in_10(num, e)
  baseSum = digitsum(num, e)
  matching = (0..9).select { |i|
    (num + i) == (baseSum + e[i])
  }
  .map { |match| 
    num + match
  }
  return matching
end

ractors = []
ractors = 2.times.map do
  Ractor.new do
    while input = Ractor.receive
      n = input[0]
      e = input[1]
      Ractor.yield find_in_10(n, e)
    end
  end
end


ARGV.each do |power|
  exps = (0..9).map {|i| i ** power.to_i }

  time_elapsed = Benchmark.measure do
    i = 0
    (10..maxNumberSearch(power.to_i)).step(10).map { |num|
      ractors[i % 2].send([num, exps])
      i = i + 1
    }
    result_ractors = i.times.map do
      _r, results = Ractor.select(*ractors)
      results
    end
    rg = result_ractors.flatten
    printf "#{power}: #{rg}\n"
  end
  printf "#{power}: #{time_elapsed}\n"
end
