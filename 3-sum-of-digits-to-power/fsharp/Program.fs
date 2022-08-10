open System

module SumOfDigits =
    let findMatchesOfPower (exponent: int) =
        let rec maxNumber (digit: int) =
            let maxByDigit = int (10.0 ** digit) - 1
            let maxSumDigits = int (9.0 ** exponent) * int digit

            match (maxByDigit, maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | otherwise -> maxNumber (int (digit) + 1)

        let rec listOfDigits (x: int) =
            match x with
            | (var1) when var1 < 10 -> [ var1 ]
            | otherwise -> listOfDigits (x / 10) @ [ (x % 10) ]

        let sumDigitsToPower x =
            listOfDigits (x)
            |> List.sumBy (fun x -> float x ** exponent)

        let candidates = [ 10 .. maxNumber (2) ]

        candidates
        |> List.filter (fun x -> sumDigitsToPower (x) = x)

[<EntryPoint>]
let main args =
    printfn "%A" (SumOfDigits.findMatchesOfPower (int args[0]))
    0
