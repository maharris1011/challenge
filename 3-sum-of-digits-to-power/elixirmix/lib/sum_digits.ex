defmodule SumDigits do
  use Application

  @moduledoc """
  Documentation for `SumDigits`.
  """

  @doc """
  Finds numbers where the sum of the digits 
  to a power equals the number.

  ## Examples

      iex> SumDigits.find_digits()
      4150, 4151, 54748, 92727, 93084, 194979

  """

  def number_to_list_of_digits(n) do
    case n do
      n when n < 10 -> [n]
      _ -> [rem(n,10) | number_to_list_of_digits(div(n, 10))]
    end
  end

  def max_number(d, e) do
    cond do
      :math.pow(10, d) - 1 > :math.pow(9, e) * d ->
        trunc(:math.pow(9, e) * d)

      true ->
        trunc(max_number(d + 1, e))
    end
  end

  def max_number(e) do
    max_number(2, e)
  end

  def sum_of_digits_to_power(squares, n) do
    number_to_list_of_digits(n)
    |> Enum.reduce(0, fn n, acc -> acc + squares[n] end)
  end

  def main(args) do
    options = [switches: [power: :integer],aliases: [p: :power]]
    {opts,_,_}= OptionParser.parse(args, options)
    power = opts[:power]

    squares = Enum.to_list(0..9).map(fn n -> :math.pow(n, power) end)
    candidates = 10..SumDigits.max_number(power)
    sum_matches_number = Stream.filter(candidates, 
      fn(n) -> SumDigits.sum_of_digits_to_power(squares, n) == n end)

    IO.inspect Enum.to_list(sum_matches_number)
  end

  def start(_type, _args) do
    Supervisor.start_link [], strategy: :one_for_one
  end
end
