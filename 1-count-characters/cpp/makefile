PLATFORM?=osx-arm64
SOURCES=charcountmethod.cpp
BINARY=charcountmethod

all : clean build publish

clean:
	rm $(BINARY)

build: $(SOURCES)
	clang $(SOURCES) -o $(BINARY)

publish: $(SOURCES)
	clang $(SOURCES) -o $(BINARY)

