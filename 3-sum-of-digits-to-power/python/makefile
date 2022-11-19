run:
	python3 digitsum.py -p 3; \
	for i in 3 4 5 6 7 8 9; \
	do \
		time python3 digitsum.py -p $$i; \
	done

init:
	pip3 install -r requirements.txt --user

test:
	nosetests tests
