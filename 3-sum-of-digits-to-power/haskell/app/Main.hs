module Main where
import System.Environment

import Data.Char (digitToInt)

-- Returns the sum of the cubes of the digits of a number
sumCubes :: Int -> Int -> Int
sumCubes x e = do
  (sum . map (^e) . map digitToInt . show) x

-- Returns numbers in the next 10 for which the sum of the
-- cubes of their digits equals the number itself
specialNumbersInNext10 :: Int -> Int -> [Int]
specialNumbersInNext10 e n = do
  [n + x | x <- [0..9], n + x == baseSum + (x ^ e)]
  where baseSum = sumCubes n e

specialNumbers' :: Int -> Int -> Int -> [Int]
specialNumbers' n e maxNumber
  | n > maxNumber = []
  | otherwise = specialNumbers' (n+10) e maxNumber ++ specialNumbersInNext10 e n

-- Returns the list of numbers for which the sum of the cubes
-- of their digits equals the original number
specialNumbers :: Int -> [Int]
specialNumbers e = do
  specialNumbers' 10 e (maxNumber e)

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
