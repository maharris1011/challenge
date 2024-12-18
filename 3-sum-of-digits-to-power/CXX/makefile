POWER?=5
PLATFORM?=osx-arm64
all : clean build publish

clean: digitsum narcissist
	rm digitsum 
	rm narcissist

build: digitsum.cpp narcissistic-cgpt.cpp
	clang++ -o digitsum digitsum.cpp
	clang++ -std=c++23 -o narcissist narcissistic-cgpt.cpp

publish: digitsum.cpp narcissistic-cgpt.cpp
	clang++ -o digitsum digitsum.cpp
	clang++-16 -std=c++23 -o narcissist narcissistic-cgpt.cpp

run: publish
	time ./digitsum $(POWER)

rungpt: publish
	time ./narcissist $(POWER)

test: publish
	./digitsum 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./digitsum $$i; \
	done

testgpt: publish
	./narcissist 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time ./narcissist $$i; \
	done


