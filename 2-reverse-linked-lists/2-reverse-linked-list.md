# Reverse Linked List
The point of this exercise is to see how you think through a challenging/non-obvious solution. This
is a bit harder than the first challenge. A correct solution is functionally correct, 

# Challenge
Given the singly-linked list below, write a function that outputs the linked list in the reverse order.
This is expressed in C, but the solution could be in any language you are comfortable with. 

```
struct node {
  node *next;
  char data;
}

node *list; // assume that this is initialized with at least 1 node

node *reverseList(node *) {
  // returns the list given as a parameter, but in reverse order
}
```

Each node in the list points to the next. The last node has a *next of NULL.

**NOTE:** do not use the C++ standard library functions for list manipulation. This is an exercise
to see how you would implement the algorithm. For that matter, do not use any standard library
functions for whatever language you choose. (unless it's LISP/Scheme, in which case you can use CAR and CDR)

# Example

A -> B -> C. becomes C -> B -> A.
A becomes A (single-node lists are already reversed)
null lists are already reversed also

# To-Do
- [ ] create a folder for this challenge (2-reverse-linked-list)
- [ ] create a folder for the code solution in whatever language you'll use
- [ ] write the code
- [ ] submit a pull-request for review