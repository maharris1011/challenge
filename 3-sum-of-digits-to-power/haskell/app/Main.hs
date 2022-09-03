module Main where
import System.Environment


-- turn integer number into list of integers
listOfDigits :: Integer -> [Integer]
listOfDigits x
  | x < 10 = [x]
  | otherwise = (x `mod` 10) : listOfDigits (x `div` 10)

-- first sum of exponents where largest n-digit number > sum of 9s to exponent
maxNumber :: Integer -> Integer
maxNumber e = maxNumber' 2 (9^e) (10^2)

maxNumber' :: Integer -> Integer -> Integer -> Integer
maxNumber' d e accum
  | e * d < accum = e * d
  | otherwise = maxNumber' (d+1) e (accum * 10)

digitsToPower :: Integer -> Integer -> [Integer]
digitsToPower x e = map (^e) (listOfDigits x)

sumOfDigitsToPower num e = sum(digitsToPower num e)

candidatePairs :: Integer -> [(Integer, Integer)]
candidatePairs e = do
  let num = (maxNumber e)
  [(x, sumOfDigitsToPower x e) | x <- [10..num]]

matchingPairs :: Integer -> [(Integer, Integer)]
matchingPairs e = [(x, y) | (x, y) <- (candidatePairs e), x == y]

main :: IO ()
main = do
  args <- getArgs
  let exponent = (read $ head args :: Integer)
  print (map fst (matchingPairs exponent))
