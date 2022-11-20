binary: sum_digits 
	mix compile

run: binary
	./sum_digits --power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./sum_digits --power $$i; \
	done
