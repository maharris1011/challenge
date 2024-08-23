POWER?=5
PLATFORM?=osx-arm64
all : clean build publish

digitsum: digitsum.go
	go build digitsum.go

clean:
	rm ./digitsum

build: digitsum

publish: digitsum

run: digitsum
	./digitsum --power $(POWER)

test: publish
	./digitsum --power 3; \
	for i in 3 4 5 6 7 8 9 10; \
	do \
		time ./digitsum --power $$i; \
	done
