binary: bin/release/net6.0/osx-x64/publish/fs-sum-of-digits-to-power
	dotnet publish -c release -r osx-x64

test: binary
	for i in 3 4 5 6 7 8; \
	do \
		echo $$i;
		time bin/release/net6.0/osx-x64/publish/fs-sum-of-digits-to-power $$i; \
	done
