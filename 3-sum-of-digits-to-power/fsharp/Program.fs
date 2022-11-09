open System

module SumOfDigits =
    let findMatchesOfPower (exponent: int) =
        let digitsToPower = [ for i in 0UL .. 9UL -> uint64 (float i ** exponent) ]

        let rec maxNumber (digit: int) =
            let maxByDigit = uint64 (10.0 ** digit) - 1UL
            let maxSumDigits = uint64 (9.0 ** exponent) * uint64 digit

            match (maxByDigit, maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | otherwise -> maxNumber (digit + 1)

        let rec listOfDigits (x: uint64) =
            match x with
            | (var1) when var1 < 10UL -> [ var1 ]
            | otherwise -> [ (x % 10UL) ] @ listOfDigits (x / 10UL)

        let sumDigitsToPower (x: uint64) =
            listOfDigits (x)
            |> List.sumBy (fun digit -> digitsToPower[int digit])

        let topOfRange = maxNumber (2)
        let candidates = [ 10UL .. 10UL .. topOfRange ]

        let memoSumDigitsToPower (x: uint64) =
            let baseSum = sumDigitsToPower (x)

            for digit in 0UL .. 9UL do
                if (x + digit) = (baseSum + digitsToPower[int digit]) then
                    printf "%u, " (x + uint64 digit)

        candidates |> List.map memoSumDigitsToPower

[<EntryPoint>]
let main args =
    SumOfDigits.findMatchesOfPower (int args[0])
    |> ignore

    0
