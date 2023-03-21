POWER?=5
all : clean restore build publish

clean:
	cabal clean

build: app/Main.hs
	cabal build

publish: build

run:
	cabal run haskell-sum-of-digits-exe $(POWER)

test: publish
	cabal run haskell-sum-of-digits-exe 3; \
	cabal run haskell-sum-of-digits-exe 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		echo $$i; \
		time cabal run haskell-sum-of-digits-exe $$i; \
	done
