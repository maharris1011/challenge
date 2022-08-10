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

  def max_number(e) do
    max_number(2, e)
  end

  def sum_of_digits_to_power(n, e) do
    number_to_list_of_digits(n)
    |> Enum.map(fn n -> :math.pow(n, e) end)
    |> Enum.reduce(0, fn n, acc -> acc + n end)
  end

end

power = 5
candidates = 10..SumDigits.max_number(power)
sum_matches_number =
  for n <- candidates, SumDigits.sum_of_digits_to_power(n, power) == n do
    n
  end

IO.puts(Enum.join(sum_matches_number, ", "))

