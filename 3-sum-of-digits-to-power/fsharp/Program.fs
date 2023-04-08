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

    let sumOfDigitsRaisedToPower (cache: int64 array) (n: int64) =
        (string n).ToCharArray()
        |> Array.fold (fun acc c -> acc + cache[int c - int '0']) 0L

    let findNumbersWithSumOfDigitsRaisedToPower p =
        let maxNum = maxNumber p

        let cache =
            [| 0L .. 9L |]
            |> Array.map (fun d -> int64 (Math.Pow(float d, p)))

        let sumDigits = sumOfDigitsRaisedToPower cache

        seq {
            for n in 10L .. 10L .. maxNum do
                if n = sumDigits n then n
        }


[<EntryPoint>]
let main args =
    SumOfDigits.findNumbersWithSumOfDigitsRaisedToPower (int args[0])
    |> printf "%A\n"
    |> ignore

    0
