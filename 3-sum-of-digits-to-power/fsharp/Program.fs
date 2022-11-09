open System

module SumOfDigits =
    let cache = new System.Collections.Generic.Dictionary<_, _>()

    let findMatchesOfPower (exponent: int) =
        let digitsToPower = [ for i in 0UL .. 9UL -> uint64 (float i ** exponent) ]

        let rec maxNumber (digit: int) =
            let maxByDigit = uint64 (10.0 ** digit) - 1UL
            let maxSumDigits = uint64 (9.0 ** exponent) * uint64 digit

            match (maxByDigit, maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | otherwise -> maxNumber (digit + 1)

        let rec sumDigitsToPower (x: uint64) =
            match cache.TryGetValue x with
            | true, v -> v
            | false, _ ->
                let v =
                    match x with
                    | (var1) when var1 < 10UL -> digitsToPower[int var1]
                    | otherwise ->
                        sumDigitsToPower (x / 10UL)
                        + digitsToPower[int (x % 10UL)]

                cache.Add(x, v)
                v

        let topOfRange = maxNumber (2)
        let candidates = [ 10UL .. 10UL .. topOfRange ]

        let byTenSumDigitsToPower (x: uint64) =
            let baseSum = sumDigitsToPower (x)

            for digit in 0UL .. 9UL do
                if (x + digit) = (baseSum + digitsToPower[int digit]) then
                    printf "%u, " (x + uint64 digit)

        candidates |> List.map byTenSumDigitsToPower

[<EntryPoint>]
let main args =
    SumOfDigits.findMatchesOfPower (int args[0])
    |> ignore

    0
