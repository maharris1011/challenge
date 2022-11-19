import sys
import getopt


def max_num(exponent):
    digit = 2
    maximum = 10
    max_digit_sum = sum_digits(99, exponent)
    nine_to_the_exponent = pow(9, exponent)
    while (maximum - 1) < max_digit_sum:
        maximum *= 10
        max_digit_sum = nine_to_the_exponent * digit
        digit += 1
    return max_digit_sum


def sum_digits(num, exponent):
    total = 0
    while num > 0:
        digit = num % 10
        total += pow(digit, exponent)
        num = num // 10
    return total


def matching_numbers(maxnum, exponent):
    step = 10
    numlist = []
    cache = []
    for x in range(10):
        cache.append(pow(x, exponent))
    # find matching numbers from 10..maxnum
    for num in range(10, maxnum + step, step):
        base_sum = sum_digits(num, exponent)
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
    maxnum = max_num(exponent)
    matching = matching_numbers(maxnum, exponent)
    print(exponent, ":", maxnum, ": ", matching)


if __name__ == "__main__":
    main(sys.argv[1:])
