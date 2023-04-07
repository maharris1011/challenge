defmodule SumDigits do

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
    Enum.reduce(Integer.digits(n), 0, fn d, acc ->
      acc + :math.pow(d, e)
    end)
  end

  def numbers_in_next_10(p, n) do
    baseSum = sum_of_digits_to_power(n, p)
    Enum.to_list(0..9)
      |> Enum.filter(fn d -> (n + d) == baseSum + :math.pow(d, p) end)
      |> Enum.map(fn d -> n + d end)
  end

  def numbers_equal_to_sum_of_digits_raised_to_power(start, p, max, acc) do
    cond do
      (start > max) -> acc
      true -> numbers_equal_to_sum_of_digits_raised_to_power(start + 10, p, max, numbers_in_next_10(p, start) ++ acc)
    end
  end

  def find_for_power(p) do
    IO.inspect numbers_equal_to_sum_of_digits_raised_to_power(10, p, max_number(p), []), label: "for power #{p}"
  end
end

System.argv() |> Enum.map(fn arg -> SumDigits.find_for_power String.to_integer(arg) end)
