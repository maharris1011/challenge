

defmodule SumDigits do
  def number_to_list_of_digits(n) when n < 10 do
    [n]
  end

  def number_to_list_of_digits(n) do 
    number_to_list_of_digits(div(n, 10)) ++ [rem(n, 10)]
  end

  def max_number(d, e) do
    cond do
      (:math.pow(10, d) - 1) > (:math.pow(9, e) * d) ->
        trunc(:math.pow(9, e) * d)
      true ->
        trunc(max_number(d + 1, e))
    end
  end

  def sum_of_digits_to_power(n, e) do
    number_to_list_of_digits(n)
    |> Enum.map(fn n -> :math.pow(n, e) end)
    |> Enum.reduce(0, fn n, acc -> acc + n end)
  end

end

# list = SumDigits.number_to_list_of_digits(123)
# IO.puts(["list of digits is ", Enum.join(list, ", ")])

maxnum = SumDigits.max_number(2, 5)
IO.puts("the max number is #{maxnum}")

sum_matches_number =
  for n <- 10..maxnum, SumDigits.sum_of_digits_to_power(n, 5) == n do
    n
  end

IO.puts(Enum.join(sum_matches_number, ", "))
