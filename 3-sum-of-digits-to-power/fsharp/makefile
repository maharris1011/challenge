PLATFORM?=osx-arm64
POWER?=5
all : clean restore build publish

clean:
	dotnet clean

restore:
	dotnet restore

build: Program.fs
	dotnet build

publish: build
	dotnet publish --self-contained -c Release ./fs-sum-of-digits-to-power.fsproj

run:
	dotnet run $(POWER)

test: publish
	bin/release/net7.0/$(PLATFORM)/publish/fs-sum-of-digits-to-power 3; \
	bin/release/net7.0/$(PLATFORM)/publish/fs-sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time bin/release/net7.0/$(PLATFORM)/publish/fs-sum-of-digits-to-power $$i | grep -i real; \
	done
