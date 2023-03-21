module Main where
import System.Environment

import Data.Char (digitToInt)

-- Returns the sum of the cubes of the digits of a number
sumCubes :: Int -> Int -> Int
sumCubes x e = (sum . map (^e) . map digitToInt . show) x

-- Returns the list of numbers for which the sum of the cubes
-- of their digits equals the original number
specialNumbers :: Int -> [Int]
specialNumbers e = [x | x <- [10..maxNumber e], x == sumCubes x e]

-- first sum of exponents where largest n-digit number > sum of 9s to exponent
maxNumber :: Int -> Int
maxNumber e = maxNumber' 2 (9^e) 100

maxNumber' :: Int -> Int -> Int -> Int
maxNumber' numDigits nineToE accum
  | (nineToE * numDigits) < (accum - 1) = nineToE * numDigits
  | otherwise = maxNumber' (numDigits + 1) nineToE (accum * 10)

main :: IO ()
main = do
  args <- getArgs
  let exponent = (read $ head args :: Int)
  print (specialNumbers exponent)
