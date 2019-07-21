//This is the same function but accepts a char array instead, 
//so it doesn't require including the string library

int charCount2(char search, char input[])
{
	int count = 0, i = 0;
	while (input[i] != '\0')
	{
		if (input[i] == search)
			count++;
		i++;
	}
	return count;
}