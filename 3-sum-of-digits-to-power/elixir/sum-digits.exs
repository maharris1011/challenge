defmodule SumDigits do

  defp max_number(d, maxD, e) do
    cond do
      (maxD - 1) > (e * d) ->
        trunc(e * d)
      true ->
        trunc(max_number(d + 1, maxD * 10, e))
    end
  end

  defp max_number(e) do
    max_number(2, 100, :math.pow(9, e))
  end

  defp sum_of_digits_to_power(n, powermap) do
    Integer.digits(n) |> Enum.reduce(0, fn d, acc -> acc + Map.get(powermap, d) end)
  end

  def numbers_in_next_10(n, powermap) do
    baseSum = sum_of_digits_to_power(n, powermap)
    for d <- 0..9, (n+d) == baseSum + Map.get(powermap, d) do 
      n + d
    end
  end

  def numbers_equal_to_sum_of_digits_raised_to_power(start, p, max) do
    {_, powermap} = Enum.to_list(0..9) |> Enum.map_reduce(%{}, fn x, acc -> {x, Map.put(acc, x, :math.pow(x,p))} end)
    Enum.to_list(start..max//10) |> Enum.map(fn base -> numbers_in_next_10(base, powermap) end) |> List.flatten
  end

  def find_for_power(p) do
    IO.inspect numbers_equal_to_sum_of_digits_raised_to_power(10, p, max_number(p)), label: "for power #{p}"
  end
end

System.argv() |> Enum.map(fn arg -> SumDigits.find_for_power String.to_integer(arg) end)
