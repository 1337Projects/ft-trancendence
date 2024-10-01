import random
import string

def customize(name):
    name = name.split()
    length = len(name)
    if (length <= 1):
        return name
    elif length == 2:
        return f"{name[0][0]}{name[1][0:]}"
    elif length > 2:
        i = 2
        username = f"{name[0][0]}{name[1][0:]}-"
        while (i < length):
            username += name[i][0:]
            i += 1
        return username

name = 'mohammed el harchi jj kk'

print(name)
print(customize(name))
print(name)