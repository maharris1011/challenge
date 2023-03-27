PLATFORM?=osx-arm64
POWER?=5
all : clean build

clean:
	rm Sumdigits.class

build: Sumdigits.java DigitFinder.java
	javac DigitFinder.java Sumdigits.java

run: build
	java Sumdigits $(POWER)

test: build
	java Sumdigits 3; \
	java Sumdigits 3; \
	java Sumdigits 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time java Sumdigits $$i; \
	done
