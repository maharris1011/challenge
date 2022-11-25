bin/release/net7.0/osx-arm64/publish/fs-sum-of-digits-to-power:
	dotnet publish -c release --self-contained -r osx-arm64

binary: bin/release/net7.0/osx-arm64/publish/fs-sum-of-digits-to-power

test: binary
	for i in 3 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time bin/release/net7.0/osx-arm64/publish/fs-sum-of-digits-to-power $$i; \
	done
