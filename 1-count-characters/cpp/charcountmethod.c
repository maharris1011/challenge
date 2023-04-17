#include <stdio.h>

#define ASSERT(expr, str) (expr) ? printf("true: %s\n", str) : printf("FAILED: %s\n", str)

int charCount(char search, char *input)
{
	int count = 0;
	for (int i = 0; NULL != input && input[i] != '\0'; i++)
		if (input[i] == search)
			count++;
	return count;
}

int main(int argc, char **argv)
{
	ASSERT(charCount('a', "a") == 1, "count of 1 is 1");
	ASSERT(charCount('c', "a") == 0, "count of c in a is 0");
	ASSERT(charCount('b', "abc") == 1, "count of b in abc is 1");
	ASSERT(charCount('d', NULL) == 0, "count of chars in NULL is 0");
}