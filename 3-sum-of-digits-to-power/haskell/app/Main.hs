module Main where
import System.Environment


-- first sum of exponents where largest n-digit number > sum of 9s to exponent
maxNumber :: Integer -> Integer
maxNumber e = maxNumber' 2 9^e 100

maxNumber' :: Integer -> Integer -> Integer -> Integer
maxNumber' numDigits nineToE accum
  | (nineToE * numDigits) < (accum - 1) = nineToE * numDigits
  | otherwise = maxNumber' (numDigits + 1) nineToE (accum * 10)

-- turn integer number into list of integers
listOfDigits :: Integer -> [Integer]
listOfDigits x
  | x < 10 = [(x)]
  | otherwise = ((x `mod` 10)) : listOfDigits (x `div` 10)

sumOfDigitsToPower :: Integer -> [Integer] -> Integer
sumOfDigitsToPower num l = 
  let toPower i = l !! (fromIntegral i)
      digitsToPower = map (toPower) (listOfDigits num)
  in sum $ digitsToPower

matchingPairs :: Integer -> [(Integer, Integer)]
matchingPairs e = [(x, y) | (x, y) <- candidatePairs, x == y]
  where l = map (^e) [0..9]
        candidatePairs = [(x, sumOfDigitsToPower x l) | x <- [10..(maxNumber e)]]

main :: IO ()
main = do
  args <- getArgs
  let exponent = (read $ head args :: Integer)
  print (map fst (matchingPairs exponent))
