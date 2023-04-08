open System

module SumOfDigits =
    let maxNumber (exponent: int) : int64 =
        let nineToTheExponent = int64 (Math.Pow(9.0, exponent))

        let (_, maxPowerNum) =
            [ 0L .. 15L ]
            |> List.map (fun d -> (int64 (Math.Pow(10.0, float d)) - 1L, nineToTheExponent * d))
            |> List.filter (fun (a, b) -> a > b)
            |> List.head

        maxPowerNum

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
            for n in 10L .. maxNum do
                if n = sumDigits n then yield n
        }

[<EntryPoint>]
let main args =
    SumOfDigits.findNumbersWithSumOfDigitsRaisedToPower (int args[0])
    |> List.ofSeq
    |> printf "%A\n"
    |> ignore

    0
