defmodule SumDigits do
  def number_to_list_of_digits(n) when n < 10 do
    [n]
  end

  def number_to_list_of_digits(n) do 
    [rem(n, 10) | number_to_list_of_digits(div(n, 10))]
  end

  def max_number(d, maxD, e) do
    cond do
      (maxD - 1) > (e * d) ->
        trunc(e * d)
      true ->
        trunc(max_number(d + 1, maxD * 10, e))
    end
  end

  def max_number(e) do
    max_number(2, 100, :math.pow(9,e))
  end

  def sum_of_digits_to_power(n, e) do
    Enum.reduce(number_to_list_of_digits(n), 0, fn n, acc -> 
      acc + :math.pow(n,e) 
    end)
  end

  def find_numbers_with_sum_of_digits_raised_to_power(p) do
    Enum.filter(10..SumDigits.max_number(p), fn n ->
      sum_of_digits_to_power(n, p) == n
    end)
  end

end

power = 5
matches = SumDigits.find_numbers_with_sum_of_digits_raised_to_power(power)
IO.inspect matches, label: "for power #{power}"

