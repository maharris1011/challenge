import sys
import getopt

cache = {}


def max_num(exponent):
    digit = 2
    while (10**digit - 1) < (9**exponent * digit):
        digit += 1
    return (9**exponent * digit)


def sum_of_digits_raised_to_power(n, p):
    return sum(cache[int(d)] for d in str(n))


def matching_numbers(maxnum, exponent):
    numlist = []
    # find matching numbers from 10..maxnum
    for num in range(10, maxnum + 10, 10):
        base_sum = sum_of_digits_raised_to_power(num, exponent)
        for j in range(10):
            if (base_sum + cache[j]) == (j + num):
                numlist.append(j + num)
    return numlist


def main(argv):
    exponent = 5

    try:
        opts, args = getopt.getopt(argv, "hp:", ["help", "power"])
    except getopt.GetoptError:
        print('digitsum.py -p <exponent>')
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print('digitsum.py -p <exponent>')
            sys.exit()
        elif opt in ("-p", "--power"):
            print('arg = ', arg)
            exponent = int(arg)

    for x in range(10):
        cache[x] = pow(x, exponent)
    maxnum = max_num(exponent)
    matching = matching_numbers(maxnum, exponent)
    print(exponent, ":", maxnum, ": ", matching)


if __name__ == "__main__":
    main(sys.argv[1:])
