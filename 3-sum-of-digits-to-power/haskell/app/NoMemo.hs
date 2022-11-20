module Main where
import System.Environment
import Data.Function (fix)

-- first sum of exponents where largest n-digit number > sum of 9s to exponent
maxNumber :: Int -> Integer
maxNumber e = maxNumber' 2 (9^e) 100

maxNumber' :: Integer -> Integer -> Integer -> Integer
maxNumber' numDigits nineToE accum
  | (nineToE * numDigits) < (accum - 1) = nineToE * numDigits
  | otherwise = maxNumber' (numDigits + 1) nineToE (accum * 10)

sumOfDigitsToPowerRec :: [Integer] -> Integer -> Integer
sumOfDigitsToPowerRec l num
  | num < 10 = (l !! fromIntegral num)
  | otherwise = (l !! fromIntegral (num `mod` 10)) + sumOfDigitsToPowerRec l (num `div` 10)

sumOfDigitsToPowerMemo :: [Integer] -> Int -> Integer
sumOfDigitsToPowerMemo l = (map sumOfDigitsToPower [0..] !!)
  where sumOfDigitsToPower 0 = 0
        sumOfDigitsToPower 1 = 1
        sumOfDigitsToPower 2 = l !! 2
        sumOfDigitsToPower 3 = l !! 3
        sumOfDigitsToPower 4 = l !! 4
        sumOfDigitsToPower 5 = l !! 5 
        sumOfDigitsToPower 6 = l !! 6
        sumOfDigitsToPower 7 = l !! 7
        sumOfDigitsToPower 8 = l !! 8
        sumOfDigitsToPower 9 = l !! 9
        sumOfDigitsToPower num = (sumOfDigitsToPowerRec l (num `div` 10)) + (l !! fromIntegral (num `mod` 10))

matchingPairs :: Int -> [(Integer, Integer)]
matchingPairs e = [(x, y) | (x, y) <- candidatePairs, x == y]
  where l = map (^e) [0..9]
        candidatePairs = [(x, sumOfDigitsToPowerRec l (fromIntegral x)) | x <- [10..(maxNumber e)]]

main :: IO ()
main = do
  args <- getArgs
  let exponent = (read $ head args :: Int)
  print (map fst (matchingPairs (exponent)))
