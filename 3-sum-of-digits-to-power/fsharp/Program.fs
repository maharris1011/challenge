open System

module SumOfDigits =
    let findMatchesOfPower (exponent: int) =
        let digitsToPower = [| for i in 0..9 -> int (float i ** exponent) |]

        let rec maxNumber (digit: int) =
            let maxByDigit = int (10.0 ** digit) - 1
            let maxSumDigits = int (9.0 ** exponent) * int digit

            match (maxByDigit, maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | otherwise -> maxNumber (digit + 1)

        let rec listOfDigits (x: int) =
            match x with
            | (var1) when var1 < 10 -> [ var1 ]
            | otherwise -> [ (x % 10) ] @ listOfDigits (x / 10)

        let sumDigitsToPower x =
            listOfDigits (x)
            |> List.sumBy (fun x -> digitsToPower[x])

        let topOfRange = maxNumber (2)
        let candidates = [ 10..topOfRange ]

        candidates
        |> List.filter (fun x -> sumDigitsToPower (x) = x)

[<EntryPoint>]
let main args =
    printfn "%A" (SumOfDigits.findMatchesOfPower (int args[0]))
    0
