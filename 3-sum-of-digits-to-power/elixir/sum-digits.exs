defmodule SumDigits do

  @parallel_threshold 4

  defp max_number(d, maxD, e) do
    cond do
      (maxD - 1) > (e * d) ->
        e * d
      true ->
        max_number(d + 1, maxD * 10, e)
    end
  end

  defp max_number(e) do
    max_number(2, 100, Integer.pow(9, e))
  end

  defp digit_sum(0, _table, acc), do: acc
  defp digit_sum(n, table, acc) do
    digit_sum(div(n, 10), table, acc + elem(table, rem(n, 10)))
  end

  defp numbers_in_next_10(n, table) do
    base_sum = digit_sum(n, table, 0)
    for d <- 0..9, (n + d) == base_sum + elem(table, d), do: n + d
  end

  defp search_serial(start, max, table) do
    start..max//10 |> Enum.flat_map(&numbers_in_next_10(&1, table)) |> Enum.sort()
  end

  defp search_parallel(start, max, table) do
    n = System.schedulers_online()
    total_blocks = div(max - start, 10) + 1
    blocks_per_task = max(1, div(total_blocks + n - 1, n))
    chunk_step = blocks_per_task * 10

    start..max//chunk_step
    |> Enum.map(fn chunk_start ->
        chunk_end = min(chunk_start + chunk_step - 10, max)
        Task.async(fn ->
          chunk_start..chunk_end//10 |> Enum.flat_map(&numbers_in_next_10(&1, table))
        end)
    end)
    |> Task.await_many(120_000)
    |> List.flatten()
    |> Enum.sort()
  end

  def numbers_equal_to_sum_of_digits_raised_to_power(start, p, max) do
    table = 0..9 |> Enum.map(&Integer.pow(&1, p)) |> List.to_tuple()
    if p >= @parallel_threshold do
      search_parallel(start, max, table)
    else
      search_serial(start, max, table)
    end
  end

  def find_for_power(p) do
    IO.inspect numbers_equal_to_sum_of_digits_raised_to_power(10, p, max_number(p)), label: "for power #{p}"
  end
end

System.argv() |> Enum.map(fn arg -> SumDigits.find_for_power String.to_integer(arg) end)

