## imports
import sys
import os
import json
import utils
import re
from operator import itemgetter
from collections import defaultdict

## config
fconfig = "data/config.txt"
directory = ""
homedir = ""

## globals
def wrapdir(file):
    i = file.find('.tex')
    if i > -1:
        file = file[:i]
    return directory + "/" + file + ".tex"
def home(file):
    return file
cats_to_content = {}

#########################################################
##  CODE

## navigate to the directory where the tool resides
prev_dir = os.getcwd()
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


## 1. VERIFY OR SET CONFIGURATION
# verify correctness of config file and parse the config
# retrieve directory of cheatsheets
# the config file exists
if os.path.isfile(home(fconfig)):
    conf = json.load(open(home(fconfig), 'r'))
    directory = conf['directory']
# the config file doesn't exist -> we create it
else:
    directory = input("Please input directory to store cheatsheets: ")
    while (not os.path.isdir(directory)):
        directory = input("the path provided is invalid please try again: ")

    # strip directory of the '/'
    if directory[-1] == '/':
        directory = directory[:-1]

    conf = {}
    conf['directory'] = directory
    json.dump(conf, open(home(fconfig), 'w'))

##[[[
print(directory)
##]]]

# 2. PARSING THE ENTRY LINE!
# the argument is the .cht file which we must read!
arg = sys.argv[-1]
argsarray = [] # format [(lang,cat,subcat,desc,code),...]
lbreak = False
lines = open(arg, 'r').readlines()
prev = 0

# 2b. PARSING THE INPUT FILE
## This results in an array of knowledge where entries are (lang, cat, subcat, desc, code)
# find breaking points
bps = [i for i in range(len(lines)) if re.search('\[.*[;].*[;].*\]', lines[i]) != None]

for i in range(len(bps)):
    start, end = bps[i], len(lines) if i >= len(bps)-1 else bps[i+1]

    # the specifications for the location of the cheatsheet
    profile = [i.strip() for i in lines[start].split(";")]
    if len(profile) != 3:
        print("The input must be of format <lang>;<category>;<subcategory>!")
        exit()

    lang, cat, subcat = profile[0][1:], profile[1], profile[2][:-1]

    # the boundaries for the description and code
    bounds = [j for j in range(start,end) if lines[j].find("~~~~") > -1]
    if len(bounds) != 4:
        print("~~~~~ is missing somewhere in knowledge block starting at line " + str(start))
        exit()
    desc = [lines[l] for l in range(bounds[0] + 1, bounds[1])]
    code = [lines[l] for l in range(bounds[2] + 1, bounds[3])]
    argsarray.append((lang, cat, subcat, "".join(desc), "".join(code)))

### !!!!!! ADDING ALL THE KNOWLEDGE IN THE FILE TO !!!!!!
### !!!!!! THE DESTINATION CHEATSHEETS             !!!!!!

for lang, cat, subcat, desc, code in argsarray:

    # 3. LOAD OR CREATE CHEATSHEET
    ## create new cheatsheet if not exists or
    ## parse the cheatsheet of the language into
    ## map <category>:[content]

    # get the lang cheatsheet or create a new one (hash)
    if os.path.isfile(wrapdir(lang)):
        cats_to_content = utils.parselang(wrapdir(lang))
    else:
        valid = input("cheatsheet" + lang + " doesn't exist! create new one? Y/N")
        if valid == "Y":
            cats_to_content = utils.create_new_lang(lang)
        else:
            exit()

    ## now we have the cheatsheet as a hash in memory!
    # <category>:[list of content]

    # 4. HANDLE CATEGORY
    ## see if category exists
    if cat in cats_to_content.keys():
        # category has been found and we can move on
        pass
    else:
        # recommend most similar categories or choose new one
        keys = [k for k in cats_to_content.keys() if k not in ["START","END"]]
        recommendations = sorted([(i, utils.edit_distance(k, cat)) for i, k in enumerate(keys)], key=itemgetter(1))
        print("Category " + cat + " not recognized. Choose one of following:")
        print("-1 = add new category")
        for i, rec in recommendations[:min(3, len(keys))]:
            print(str(i) + " = " + keys[i])
        inpt = input("choice: ")
        inpt = int(inpt)
        if inpt == -1:
            # cat stays the same - we create a new one!
            pass
        else:
            if inpt >= 0 and inpt < len(keys):
                cat = keys[inpt]
            else:
                print("Invalid choice. Exiting program")
                exit()

    # 5. HANDLE SUBCATEGORY
    ## now we have both the lang and the category!
    # TODO: subcategories

    # 6. HANDLE THE NEW KNOWLEDGE

    ## query user for new knowledge to append to the category!
    print("Language: " + lang + "; Category:"  + cat)

    beg = desc + "\n"
    beg += "\\tiny{}\n"
    beg += "\\begin{verbatim}\n"
    beg += code + "\n"
    beg += "\\end{verbatim}\n"
    beg += "\\normalsize{}\n"

    ## verify that the knowledge piece is not already stored
    # if it is, then ignore this knowledge piece!
    if ''.join(cats_to_content[cat]).find(beg) != -1:
        print("Knowledge piece already contained in cheatsheet!")
        continue

    if not cat in cats_to_content:
        cats_to_content[cat] = []
    cats_to_content[cat].append(beg)


    ## save the whole hash back to the file
    str_full = utils.hash_to_string(cats_to_content)
    a = open(wrapdir(lang), 'w')
    a.write(str_full)
    a.close()

    print("Knowledge stored. Exiting program.")
os.chdir(prev_dir)