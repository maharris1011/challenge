/*
  Reverse Linked twoNode
*/
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

typedef struct node
{
  struct node *next;
  char data;
} NODE;

#define ASSERT(expr, str) (expr) ? printf("true: %s\n", str) : printf("FAILED: %s\n", str)

NODE *reverse_string(NODE *first)
{
  // returns the twoNode in reverse order
  if (NULL == first)
  {
    return NULL;
  }
  else if (first->next == NULL)
  {
    return first;
  }
  else
  {
    NODE *reversed = reverse_string(first->next);
    NODE *last = reversed;
    while (last->next != NULL)
    {
      last = last->next;
    }
    first->next = NULL;
    last->next = first;
    return reversed;
  }
}

char *listToString(NODE *twoNode)
{
  char *string = (char *)malloc(255 * sizeof(char));
  int i = 0;
  while (twoNode != NULL)
  {
    string[i++] = twoNode->data;
    twoNode = twoNode->next;
  }
  string[i++] = '\0';
  return string;
}

int main(int argc, char *argv[])
{
  NODE *oneNode = (NODE *)malloc(sizeof(NODE));
  oneNode->next = NULL;
  oneNode->data = 'a';
  ASSERT(strcmp(listToString(oneNode), "a") == 0, "listToString of a should equal a");

  NODE *twoNode = (NODE *)malloc(sizeof(NODE));
  twoNode->next = NULL;
  twoNode->data = 'a';
  NODE *n = (NODE *)malloc(sizeof(NODE));
  n->data = 'b';
  n->next = NULL;
  twoNode->next = n;
  ASSERT(strcmp(listToString(twoNode), "ab") == 0, "listToString of ab should equal ab");

  NODE *threeNode = (NODE *)malloc(sizeof(NODE));
  threeNode->data = 'a';
  threeNode->next = (NODE *)malloc(sizeof(NODE));
  threeNode->next->data = 'b';
  threeNode->next->next = (NODE *)malloc(sizeof(NODE));
  threeNode->next->next->data = 'c';
  threeNode->next->next->next = NULL;

  ASSERT(reverse_string(NULL) == NULL, "null list reversed is null");
  ASSERT(strcmp(listToString(reverse_string(oneNode)), "a") == 0, "reverse of a equals a");
  ASSERT(strcmp(listToString(reverse_string(twoNode)), "ba") == 0, "reversed ab equals ba");
  ASSERT(strcmp(listToString(threeNode), "abc") == 0, "threeNode is abc");
  ASSERT(strcmp(listToString(reverse_string(threeNode)), "cba") == 0, "reversed threeNode is cba");
}
