bin/release/net7.0/osx-arm64/publish/cs-sum-of-digits-to-power: Program.cs
	dotnet publish --self-contained -c release -r osx-arm64

binary: bin/release/net7.0/osx-arm64/publish/cs-sum-of-digits-to-power

test: binary
	bin/release/net7.0/osx-arm64/publish/cs-sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time bin/release/net7.0/osx-arm64/publish/cs-sum-of-digits-to-power $$i; \
	done
