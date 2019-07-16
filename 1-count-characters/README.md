# Counting Characters
The point of this exercise is to work out a solution to a problem, and then to optimize it. Initially,
the challenge asks for a function that counts characters, but with each succeeding challenge, the 
solution is optimized, until it gets as fast & memory-efficient as possible.

# Challenge
Write a function, in the language of your choice, that counts the number of characters 
in an arbitrary string. The function should accept two parameters: a string and the 
character to count. It should return an integer that is the number of occurrences of the
character in the string, or 0 if the character does not appear in the string.

The character will be one character in the ASCII character set, for example, 'a' or 'b' or '$'.
The string will be represented however the programming language you choose represents
strings. For example, in C, the string will be a ```char *```. There are no limits on
the length of the string.

The challenge is to write the code in as optimal a way possible, without using the system 
libraries. There is very likely a system library that counts matching characters in a string, 
which would defeat the purpose of learning.

# Test Cases
- fn('a', "abc") == 1
- fn('a', "abba") == 2
- fn('a', "bccd") == 0
- fn('c', "bccd") == 2
- fn('e', "") == 0
- fn('', "") == 0
- fn('', "abcdef") == 0
