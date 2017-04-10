import utils
import random
import string
import time

# should I use edit distance of bag of words for distance computations between categories!

a = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5000))
b = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5000))

tm = time.time()
utils.edit_distance(a, b)
print (time.time() - tm)

