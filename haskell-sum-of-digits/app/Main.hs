module Main where

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
  let mini = maxNumber 2 e
  filter p [10..mini]
    where p x = (sum (map (^e) (listOfDigits x))) == x

main :: IO ()
main = do
  print (findMatchesOfPower 5)
