## note that categories begin with
## %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
## %% catname
## %% \textbf{\underline{catname}} \newline

ending_marker = "\\color{white}endingblablabla"

def parselang(file):

    mhash = {}
    start = 0
    ending = 0

    ## read the file
    lines = open(file, 'r').readlines()

    ## find the start of the file
    ## THE CHEATSHEET MUST HAVE
    ## %%%%%[BEGINCHEATSHEET]%%%%% one line before the first category!
    for i in range(len(lines)):
        if lines[i].find("[BEGINCHEATSHEET]") > -1:
            start = i+1
            break

    ## find the end of the file
    for i in range(len(lines)):
        if lines[-i].find("\\end{multicols*}") > -1:
            ending = len(lines)-i
            break

    mhash['START'] = lines[:start]
    mhash['END']= lines[ending:]

    ## indicate the category lines
    for i in range(start, ending-2):
        a = lines[i].find("%%%%%%%%%%%%%%%%%%%%%%%")
        b = lines[i+1].find("%%")
        c = lines[i+2].find("\\textbf{\\underline{")

        ## we have found a category
        if a > -1 and b > -1 and c > -1:
            d = lines[i+2].find("}}")
            catname = lines[i+2][(c + len("\\textbf{\\underline{")):d]
            if catname == 'SciPy Tutorial':
                print()

            for j in range(i+3,len(lines)-2):
                a = lines[j].find("%%%%%%%%%%%%%%%%%%%%%%%")
                b = lines[j+1].find("%%")
                c = lines[j+2].find("\\textbf{\\underline{")
                if a > -1 and b > -1 and c > -1:
                    mhash[catname] = lines[i+3:j]
                    i = j-2
                    break
                if j >= ending-1:
                    mhash[catname] = lines[i+3:ending]
                    break
    ## delete all the vfills and columnbreaks (ugly temp solution)
    ## also delete the ending marker
    for key in mhash:
        tmp = mhash[key]
        new_tmp = []
        for k in tmp:
            if not (k.find("\\vfill") == 0 or
                    k.find("\\columnbreak") == 0 or
                    k.find(ending_marker) == 0):
                new_tmp.append(k)
        mhash[key] = new_tmp

    return mhash

def create_new_lang(name):
    '''
    creates a new cheatsheet hash and does not save it!
    '''
    lst = open('data/template.txt', 'r').readlines()
    searchstr = "\\textbf{replace}"
    rplc, rplcidx = "", 0
    for i in range(len(lst)):
        if lst[i].find(searchstr) > -1:
            rplc, rplcidx = lst[i], i


    lidx = rplc.find(searchstr)
    ridx = lidx + len(searchstr)

    # update name
    name =  '\\textbf{' + (name if name[0].isupper() else name[0].upper() + name[1:])\
            + " Cheatsheet"+ "}"
    rplc = rplc[:lidx] + name + rplc[ridx:]
    lst[rplcidx] = rplc
    hsh = {}
    idx = [i for i in range(len(lst)) if lst[i].find("[BEGINCHEATSHEET]") > 0][0]
    hsh["START"] = lst[:idx+1]
    hsh["END"] = lst[idx+1:]
    return hsh

def hash_to_string(hsh):
    # write the hash to final string to be written to file
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    #%% Scikit-learn Tutorial
    #\textbf{\underline{Scikit-learn Tutorial}} \newline
    #\newline
    full_string = ""
    full_string += "".join(hsh["START"])
    beginner = True
    for key in sorted(hsh.keys()):
        if key == "START" or key == "END":
            pass
        else:
            # add columnbreaks at the beginning of every (non-first) category
            # to end the previous category!
            if beginner == False:
                full_string += "\\vfill\n"
                full_string += "\\columnbreak\n"
            else:
                beginner = False

            # add the content of the category
            full_string += "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n" \
                           "%% " + key + "\n" \
                           "\\textbf{\\underline{" + key + "}} \\newline\n" \
                           "\\newline\n"
            full_string += "".join(hsh[key])
    full_string += ending_marker + "\n"
    full_string += "".join(hsh["END"])
    return full_string

def edit_distance(s1, s2):
    m=len(s1)+1
    n=len(s2)+1

    tbl = {}
    for i in range(m): tbl[i,0]=i
    for j in range(n): tbl[0,j]=j
    for i in range(1, m):
        for j in range(1, n):
            cost = 0 if s1[i-1] == s2[j-1] else 1
            tbl[i,j] = min(tbl[i, j-1]+1, tbl[i-1, j]+1, tbl[i-1, j-1]+cost)

    return tbl[i,j]
