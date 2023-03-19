open System

module SumOfDigits =
    // let cache = new System.Collections.Generic.Dictionary<_, _>()

    let sumOfDigitsRaisedToPower (n: uint64) (p: int) =
        let rec loop (m: uint64) acc =
            match m with
            | 0UL -> acc
            | _ -> loop (m / 10UL) (acc + int64 (Math.Pow(float m % 10.0, float p)))

        loop n 0L

    let maxNumber (exponent: int) : uint64 =
        let nineToTheExponent = 9.0 ** exponent
        let rec loop (digit: int) =
            let maxByDigit = uint64 (10.0 ** digit) - 1UL
            let maxSumDigits = uint64 (nineToTheExponent) * uint64 digit

            match (maxByDigit, maxSumDigits) with
            | (var1, var2) when var1 > var2 -> var2
            | otherwise -> loop (digit + 1)

        loop 2

    let findNumbersWithSumOfDigitsRaisedToPower p =
        [ 10UL .. maxNumber (p) ]
        |> List.filter (fun n -> sumOfDigitsRaisedToPower n p = int64 n)


    let findMatchesOfPower (exponent: int) =
        let digitsToPower = [ for i in 0UL .. 9UL -> uint64 (float i ** exponent) ]

        let rec sumDigitsToPower (n: uint64) =
            let rec loop (m: uint64) acc =
                match m with
                | 0UL -> acc
                | _ -> loop (m / 10UL) (acc + digitsToPower[int (m % 10UL)])

            loop n 0UL

        // let rec sumDigitsToPower (x: uint64) =
        //     match cache.TryGetValue x with
        //     | true, v -> v
        //     | false, _ ->
        //         let v =
        //             match x with
        //             | (var1) when var1 < 10UL -> digitsToPower[int var1]
        //             | otherwise ->
        //                 sumDigitsToPower (x / 10UL)
        //                 + digitsToPower[int (x % 10UL)]

        //         cache.Add(x, v)
        //         v

        let topOfRange = maxNumber (exponent)
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
    // SumOfDigits.findNumbersWithSumOfDigitsRaisedToPower (int args[0])
    // |> printfn "%A"

    0
