PLATFORM?=osx-arm64
POWER?=5
all : clean restore build publish

clean:
	cargo clean

build: src/main.rs
	cargo build

publish: src/main.rs
	cargo build --release

run:
	cargo run -- --power $(POWER)

test: publish
	target/release/sumdigits --power 3; \
	target/release/sumdigits --power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time target/release/sumdigits --power $$i; \
	done
