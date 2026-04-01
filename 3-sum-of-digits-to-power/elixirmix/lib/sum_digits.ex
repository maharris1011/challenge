defmodule SumDigits do
  use Application

  @parallel_threshold 4

  defp digit_sum(0, _table, acc), do: acc
  defp digit_sum(n, table, acc) do
    digit_sum(div(n, 10), table, acc + elem(table, rem(n, 10)))
  end

  defp numbers_in_next_10(n, table) do
    base_sum = digit_sum(n, table, 0)
    for d <- 0..9, (n + d) == base_sum + elem(table, d), do: n + d
  end

  def max_number(d, maxInt, nineToE) do
    highNines = nineToE * d
    cond do
      (maxInt - 1) > highNines ->
        highNines
      true ->
        max_number(d + 1, maxInt * 10, nineToE)
    end
  end

  def max_number(e) do
    max_number(2, 10, Integer.pow(9, e))
  end

  defp search_serial(max, table) do
    10..max//10 |> Enum.flat_map(&numbers_in_next_10(&1, table)) |> Enum.sort()
  end

  defp search_parallel(max, table) do
    n = System.schedulers_online()
    total_blocks = div(max - 10, 10) + 1
    blocks_per_task = max(1, div(total_blocks + n - 1, n))
    chunk_step = blocks_per_task * 10

    10..max//chunk_step
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

  def main(args) do
    options = [switches: [power: :integer], aliases: [p: :power]]
    {opts, _, _} = OptionParser.parse(args, options)
    power = opts[:power]

    table = 0..9 |> Enum.map(&Integer.pow(&1, power)) |> List.to_tuple()
    max = SumDigits.max_number(power)

    results =
      if power >= @parallel_threshold do
        search_parallel(max, table)
      else
        search_serial(max, table)
      end

    IO.inspect(results)
  end

  def start(_type, _args) do
    Supervisor.start_link([], strategy: :one_for_one)
  end
end
