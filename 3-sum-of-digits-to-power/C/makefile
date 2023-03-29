POWER?=5
PLATFORM?=osx-arm64
all : clean build publish

clean:
	rm digitsum

build: Program.fs
	clang digitsum.c -o digitsum

publish: build
	clang digitsum.c -o digitsum

run:
	time ./digitsum $(POWER)

test: publish
	./digitsum 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./digitsum $$i; \
	done

