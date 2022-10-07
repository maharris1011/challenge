binary: bin/release/net6.0/osx-x64/publish/cs-sum-of-digits-to-power
	dotnet publish -c release -r osx-x64

test: binary
	bin/release/net6.0/osx-x64/publish/cs-sum-of-digits-to-power 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time bin/release/net6.0/osx-x64/publish/cs-sum-of-digits-to-power $$i; \
	done
