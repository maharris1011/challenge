POWER?=5
PLATFORM?=osx-arm64
all : clean build publish

clean:
	rm digitsum

build: digitsum.cpp
	clang++ -o digitsum digitsum.cpp

publish: digitsum.cpp
	clang++ -o digitsum digitsum.cpp

run: publish
	time ./digitsum $(POWER)

test: publish
	./digitsum 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./digitsum $$i; \
	done

