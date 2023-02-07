module Main where
import System.Environment

import Data.Char (digitToInt)

-- Returns the sum of the cubes of the digits of a number
sumCubes :: Int -> Int
sumCubes x =
  sum . map (^5) . map digitToInt . show

-- Returns the list of numbers for which the sum of the cubes of their digits equals the original number
specialNumbers :: Int -> [Int]
specialNumbers e = [x | x <- [1..maxNumber e], x == sumCubes x]


-- first sum of exponents where largest n-digit number > sum of 9s to exponent
maxNumber :: Int -> Int
maxNumber e = maxNumber' 2 (9^e) 100

maxNumber' :: Int -> Int -> Int -> Int
maxNumber' numDigits nineToE accum
  | (nineToE * numDigits) < (accum - 1) = nineToE * numDigits
  | otherwise = maxNumber' (numDigits + 1) nineToE (accum * 10)

-- turn integer number into list of integers
listOfDigits :: Int -> [Int]
listOfDigits x
  | x < 10 = [(x)]
  | otherwise = ((x `mod` 10)) : listOfDigits (x `div` 10)

sumOfDigitsToPower :: Int -> [Int] -> Int
sumOfDigitsToPower num l =
  let toPower i = l !! (fromIntegral i)
      digitsToPower = map (toPower) (listOfDigits num)
  in sum $ digitsToPower

matchingPairs :: Int -> [(Int, Int)]
matchingPairs e = [(x, y) | (x, y) <- candidatePairs, x == y]
  where l = map (^e) [0..9]
        candidatePairs = [(x, sumOfDigitsToPower x l) | x <- [10..(maxNumber e)]]

main :: IO ()
main = do
  args <- getArgs
  let exponent = (read $ head args :: Int)
<<<<<<< HEAD
  -- print (specialNumbers exponent)
  print (map fst (matchingPairs exponent))
=======
  print (specialNumbers exponent)
  -- print (map fst (matchingPairs exponent))
>>>>>>> 8803eea (use chatgpt code)
