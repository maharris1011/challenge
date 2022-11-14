binary: digitsum
	go build digitsum.go

test: binary
	./digitsum --power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./digitsum --power $$i; \
	done
