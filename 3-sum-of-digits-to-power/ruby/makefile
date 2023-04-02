POWER?=5
all : clean build publish

clean:
	echo 'cleaned'

build: digitsum.rb
	time ruby digitsum.rb $(POWER)

publish: digitsum.rb
	time ruby digitsum.rb $(POWER)

run:
	time ruby digitsum.rb $(POWER)

test: publish
	ruby digitsum.rb 3
	ruby digitsum.rb 3
	ruby digitsum.rb 3
	for i in 3 4 5 6 7 8 9; \
	do \
		time ruby digitsum.rb $$i ; \
	done
