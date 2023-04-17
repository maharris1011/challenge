POWER?=5
PLATFORM?=osx-arm64
SOURCE=reverse-list.c

all : clean build publish

clean:
	rm digitsum

build: $(SOURCE)
	clang $(SOURCE) -o reverse-list

publish: $(SOURCE)
	clang $(SOURCE) -o reverse-list

