binary: digitsum
	clang digitsum.c -o digitsum

test: binary
	./digitsum 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./digitsum $$i; \
	done
