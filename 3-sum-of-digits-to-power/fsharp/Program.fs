open System

module SumOfDigits =
    let maxNumber (exponent: int) : int64 =
        let nineToTheExponent = int64 (Math.Pow(9.0, exponent))

        let rec loop (digit: int) (maxByDigit: int64) =
            let maxSumDigits = nineToTheExponent * int64 (digit)

            match ((maxByDigit - 1L), maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | _ -> loop (digit + 1) (maxByDigit * 10L)

        loop 2 100

    let sumOfDigitsRaisedToPower (n: int64) (p: int) =
        let rec loop (m: int64) acc =
            match m with
            | 0L -> acc
            | _ -> loop (m / 10L) (acc + int64 (Math.Pow(float (m % 10L), p)))

        loop n 0L

    let narcNumbersInNextTen (n: int64) (p: int) =
        let baseSum = sumOfDigitsRaisedToPower n p

        [ 0L .. 9L ]
        |> List.map (fun d -> (n + d, baseSum + int64 (Math.Pow(float d, p))))
        |> List.filter (fun (x, y) -> x = y)
        |> List.map (fun (x, y) -> x)

    let findNumbersWithSumOfDigitsRaisedToPower p =
        let maxNum = maxNumber p

        let rec loop (m: int64) (p: int) acc =
            match m with
            | var1 when var1 > maxNum -> acc
            | _ -> loop (m + 10L) p (acc @ (narcNumbersInNextTen m p))

        loop 10L p []

[<EntryPoint>]
let main args =
    SumOfDigits.findNumbersWithSumOfDigitsRaisedToPower (int args[0])
    |> printf "%A\n"
    |> ignore

    0
