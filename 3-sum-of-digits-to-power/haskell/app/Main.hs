module Main where
import System.Environment


-- turn integer number into list of integers
listOfDigits :: Integer -> [Integer]
listOfDigits x
  | x < 10 = [x]
  | otherwise = listOfDigits (x `div` 10) ++ [(x `mod` 10)]

-- minimum number where 10^d > 9^5d
maxNumber :: Integer -> Integer -> Integer
maxNumber d e
  | 10^d-1 > (9^e) * d = (9^e) * d
  | otherwise = maxNumber (d+1) e

findMatchesOfPower :: Integer -> [Integer]
findMatchesOfPower e = do
  let minimum = maxNumber 2 e
  filter p [10..minimum]
    where p x = (sum (map (^e) (listOfDigits x))) == x

main :: IO ()
main = do
  args <- getArgs
  print (findMatchesOfPower (read $ head args :: Integer))
