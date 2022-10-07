binary: sum_digits 
	mix compile

test: binary
	./sum_digits --power 3; \
	for i in 3 4 5 6 7 8; \
	do \
		time ./sum_digits --power $$i; \
	done
