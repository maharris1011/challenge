PLATFORM?=osx-x64
POWER?=5
all : clean restore build publish

clean:
	dotnet clean

restore:
	dotnet restore

build: Program.cs
	dotnet build

publish: build
	dotnet publish --self-contained -c Release ./cs-sum-of-digits-to-power.csproj

run:
	dotnet run $(POWER)

test: publish
	bin/release/net7.0/$(PLATFORM)/publish/cs-sum-of-digits-to-power 3; \
	bin/release/net7.0/$(PLATFORM)/publish/cs-sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time bin/release/net7.0/$(PLATFORM)/publish/cs-sum-of-digits-to-power $$i; \
	done
