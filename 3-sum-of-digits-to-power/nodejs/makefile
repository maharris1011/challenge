binary: digitsum.js 

test: binary
	node ./digitsum 3; \
	for i in 3 4 5 6 7 8; \
	do \
		time node ./digitsum $$i; \
	done
