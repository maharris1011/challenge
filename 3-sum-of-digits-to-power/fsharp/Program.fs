open System
open System.Threading.Tasks

module SumOfDigits =
    let maxNumber (exponent: int) : int64 =
        let nineToTheExponent = int64 (Math.Pow(9.0, exponent))

        let (_, maxPowerNum) =
            [ 0L .. 15L ]
            |> List.map (fun d -> (int64 (Math.Pow(10.0, float d)) - 1L, nineToTheExponent * d))
            |> List.filter (fun (a, b) -> a > b)
            |> List.head

        maxPowerNum

    let sumOfDigitsArith (cache: int64 array) (n: int64) =
        let mutable sum = 0L
        let mutable num = n
        while num > 0L do
            sum <- sum + cache[int (num % 10L)]
            num <- num / 10L
        sum

    let findNumbersWithSumOfDigitsRaisedToPower p =
        let maxNum = maxNumber p

        let cache =
            [| 0L .. 9L |]
            |> Array.map (fun d -> int64 (Math.Pow(float d, p)))

        let sumDigits = sumOfDigitsArith cache

        if p >= 7 then
            let processorCount = Environment.ProcessorCount
            let rangeSize = maxNum - 10L + 1L
            let chunkSize = rangeSize / int64 processorCount
            
            let results = Array.zeroCreate processorCount
            
            Parallel.For(0, processorCount, fun i ->
                let startN = 10L + int64 i * chunkSize
                let endN = if i = processorCount - 1 then maxNum else startN + chunkSize - 1L
                
                let matches = ResizeArray<int64>()
                for n in startN .. endN do
                    if n = sumDigits n then
                        matches.Add(n)
                
                results[i] <- matches
            ) |> ignore
            
            results
            |> Array.collect (fun r -> r.ToArray())
            |> Array.sort
            |> List.ofArray
        else
            seq {
                for n in 10L .. maxNum do
                    if n = sumDigits n then yield n
            }
            |> List.ofSeq

[<EntryPoint>]
let main args =
    SumOfDigits.findNumbersWithSumOfDigitsRaisedToPower (int args[0])
    |> printf "%A\n"
    |> ignore

    0
