import sys
import getopt

cache = {}


def max_num(p):
    digit = 2
    nineToTheP = 9**p
    while (10**digit - 1) < (nineToTheP * digit):
        digit += 1
    return (nineToTheP * digit)


def sum_of_digits_raised_to_power(n, p):
    return sum(cache[int(d)] for d in str(n))


def matching_numbers(p):
    numlist = []
    maxnum = max_num(p)

    # find matching numbers from 10..maxnum
    for num in range(10, maxnum + 10, 10):
        base_sum = sum_of_digits_raised_to_power(num, p)
        for j in range(10):
            if (base_sum + cache[j]) == (j + num):
                numlist.append(j + num)
    return numlist


def main(argv):

    try:
        opts, args = getopt.getopt(argv, "hp:", ["help", "power"])
    except getopt.GetoptError:
        print('digitsum.py -p <p>')
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print('digitsum.py -p <p>')
            sys.exit()
        elif opt in ("-p", "--power"):
            print('arg = ', arg)
            p = int(arg)
            for x in range(10):
                cache[x] = pow(x, p)
            matching = matching_numbers(p)
            print(p, ": ", matching)


if __name__ == "__main__":
    main(sys.argv[1:])
