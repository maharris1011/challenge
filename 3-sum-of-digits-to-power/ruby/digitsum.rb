require 'etc'

def maxNumberSearch(e)
  d = 2
  while ((10 ** d) - 1 < (9 ** e) * d)
    d = d + 1
  end
  return (9 ** e) * d
end

# Optimized digitsum using divmod (one C call instead of % and /)
def digitsum(n, e)
  sum = 0
  while n != 0
    n, digit = n.divmod(10)
    sum += e[digit]
  end
  sum
end

# Single-threaded version - optimized for small to medium powers
def find_narcissistic_single(power, exps, max_num)
  results = []
  (10..max_num).step(10) do |num|
    base_sum = digitsum(num, exps)
    # Inlined find_in_10 logic - avoids method call overhead and intermediate arrays
    10.times do |i|
      if (num + i) == (base_sum + exps[i])
        results << (num + i)
      end
    end
  end
  results
end

# Parallel version using Ractors for very large powers (>= 8)
def find_narcissistic_parallel(power, exps, max_num)
  num_workers = [Etc.nprocessors, 8].min
  
  workers = num_workers.times.map do
    Ractor.new do
      while input = Ractor.receive
        num, e = input
        matches = []
        base_sum = 0
        n = num
        # Inline digitsum with divmod
        while n != 0
          n, digit = n.divmod(10)
          base_sum += e[digit]
        end
        # Inline find_in_10 logic
        10.times do |i|
          if (num + i) == (base_sum + e[i])
            matches << (num + i)
          end
        end
        Ractor.yield matches
      end
    end
  end
  
  work_count = 0
  (10..max_num).step(10) do |num|
    workers[work_count % num_workers].send([num, exps])
    work_count += 1
  end
  
  results = []
  work_count.times do
    _ractor, matches = Ractor.select(*workers)
    results.concat(matches)
  end
  
  results.sort
end

ARGV.each do |power|
  e = power.to_i
  exps = (0..9).map { |i| i ** e }
  max_num = maxNumberSearch(e)
  
  # Use parallel execution for power >= 8 (search space > 38M iterations)
  # Below that, single-threaded is faster due to Ractor overhead
  if e >= 8
    rg = find_narcissistic_parallel(e, exps, max_num)
  else
    rg = find_narcissistic_single(e, exps, max_num)
  end
  
  printf "#{e}: #{rg}\n"
end
