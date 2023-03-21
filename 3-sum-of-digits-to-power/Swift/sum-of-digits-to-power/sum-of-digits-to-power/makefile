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
	swift run $(POWER)

test: publish
	.build/$(PLATFORM)/release/sum-of-digits-to-power 3; \
	.build/$(PLATFORM)/release/sum-of-digits-to-power 3; \
	.build/$(PLATFORM)/release/sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time .build/$(PLATFORM)/release/sum-of-digits-to-power $$i; \
	done
