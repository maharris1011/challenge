module Main where

listOfDigits :: Integer -> [Integer]
listOfDigits x
  | x < 10 = [x]
  | otherwise = (x `mod` 10):listOfDigits (x `div` 10)

pow :: Integer -> Integer -> Integer
pow e x = x ^ e

digitSumPower :: Integer -> Integer -> Integer
digitSumPower x n = sum (map (pow n) (listOfDigits x))

findMatch :: Integer -> Integer
findMatch x
  | x == (digitSumPower x 5) = x
  | otherwise = -1

main :: IO ()
main = do
  let matches = [findMatch x | x <- [10..2^32]]
  print (filter (>0) matches)
