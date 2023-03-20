POWER?=5
all : clean restore build publish

clean:
	cabal clean

build: app/Main.hs
	cabal build

publish: build

run:
	cabal run $(POWER)

test: publish
	cabal run 3; \
	cabal run 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time cabal run $$i; \
	done
