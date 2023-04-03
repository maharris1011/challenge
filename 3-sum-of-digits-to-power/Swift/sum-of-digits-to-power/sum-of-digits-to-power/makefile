PLATFORM?=arm64-apple-macosx
POWER?=5
all : clean build publish

clean:
	swift package clean

build: Sources/sum-of-digits-to-power/sum_of_digits_to_power.swift
	swift build

publish: Sources/sum-of-digits-to-power/sum_of_digits_to_power.swift
	swift build -c release

run:
	swift run sum-of-digits-to-power $(POWER)

test: publish
	.build/release/sum-of-digits-to-power 3; \
	.build/release/sum-of-digits-to-power 3; \
	.build/release/sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time .build/release/sum-of-digits-to-power $$i; \
	done
