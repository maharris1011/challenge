open System

module SumOfDigits =

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


let rec maxNumber (digit: int, exponent: int) =
    let maxByDigit = uint64 (10.0 ** digit) - 1UL
    let maxSumDigits = uint64 (9.0 ** exponent) * uint64 digit

    match (maxByDigit, maxSumDigits) with
    | (var1, var2) when var1 > var2 -> var2
    | otherwise -> maxNumber (digit + 1, exponent)

// do power math only once
let digitsAtPower (e: int) =
    [ 0..9 ] |> Seq.map (fun d -> float d ** e)

// Returns the sum of the cubes of the digits of a number
let sumCubes (n: uint64, e: int) =
    n
    |> string
    |> Seq.map (fun c -> int c - 48)
    |> Seq.map (fun x -> digitsAtPower (e) |> Seq.item x)
    |> Seq.sum
    |> uint64

// Returns the list of numbers for which the sum of the cubes of their digits equals the original number
let specialNumbers e =
    let topOfRange = maxNumber (2, e)

    [ 11UL .. topOfRange ]
    |> Seq.filter (fun n -> n = sumCubes (n, e))

[<EntryPoint>]
let main args =
    specialNumbers (int args[0])
    |> Seq.toList
    |> printf "%A"
    |> ignore

    0
