#include <string>

int charCount(char search, string input)
{
	int count = 0;
	for (int i = 0; i < input.length(); i++)
		if (input[i] == search)
			count++;
	return count;
}