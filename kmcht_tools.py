import os
from operator import itemgetter
import json
import re
import utils
import sys
import time
import shutil
import datetime
import subprocess

class CheatsheetEngine:

    def __init__(self, chtdir, inputfl, guis, pdflatexpath):
        '''
        :param chtdir: The absolute path of the directory of the cheatsheets
        :param inputfl: the absolute path to the input file
        :param guis: a hash of functions that can transform the GUI!
        :return:
        '''
        self.directory = chtdir
        self.input_file = inputfl
        self.knowledge_piece_array = [] # format [(lang,cat,subcat,desc,code),...]
        self.gui_setters = guis

        if len(pdflatexpath) == 0:
            pdflatexpath = 'pdflatex'
            if sys.platform.startswith('win'):
                pdflatexpath += ".exe"
        else:
            self.pdflatexpath = pdflatexpath

        def wrapdir(file):
            i = file.find('.tex')
            if i > -1:
                file = file[:i]
            return self.directory + "/" + file + ".tex"
        self.wrapdir = wrapdir

    def start(self):

        self.create_backups()

        # fill up the knowledge piece array
        self.read_input()

        # iterate through all the knowledge pieces
        langs = []
        for lang, cat, subcat, desc, code in self.knowledge_piece_array:
            # handle cheatsheet retrieval (load or create)
            cht = self.handle_cheatsheet(lang)

            # handle the case if the category does not exist in the cheatsheet
            cat, exists = self.handle_category(cat, cht)

            if not exists:
                cht[cat] = []
            piece = self.create_current_knowledge_piece(cht, lang, cat, desc, code)

            # skip this knowledge piece if its already conteined in the cheatsheet
            if ''.join(cht[cat]).find(piece) != -1:
                self.add_msg("Knowledge piece already contained in cheatsheet!")
                continue

            # append the knowledge piece to the cheatsheet...
            cht[cat].append(piece)

            # ...and store it to disk!
            str_full = utils.hash_to_string(cht)
            a = open(self.wrapdir(lang), 'w')
            a.write(str_full)
            a.close()

            langs.append(lang)

        # compile the latex
        for lang in langs:
            self.compile_latex_docs(lang)



        self.add_msg('All new knowledge has been intergrated. You may exit the program.')

    def create_backups(self):

        currdir = os.getcwd()
        os.chdir(self.directory)

        # backup all tex files currently in cheatsheets for safety
        if not os.path.isdir('backups'):
            os.makedirs('backups')

        dirname = 'bak' + datetime.datetime.now().strftime("%Y-%m-%d%H:%M:%S")
        os.chdir('backups')
        os.makedirs(dirname)
        os.chdir('..')

        # trasfer all tex files there
        for file in os.listdir('.'):
            if file.endswith('.tex'):
                shutil.copy2(file, 'backups/' + dirname)

        self.add_msg('Created backups')
        os.chdir(currdir)


    def compile_latex_docs(self, lang):
        # langs are relative paths so still need to wrap them

        self.add_msg('Compiling document ' + lang)

        currdir = os.getcwd()
        os.chdir(self.directory)
        tmpdir = 'tmptmpdir'
        if not os.path.isdir(tmpdir):
            os.makedirs(tmpdir)

        lang = lang + '.tex'
        shutil.copy2(lang, tmpdir)
        os.chdir(tmpdir)
        a = os.getcwd() + '/' + lang

        os.system(self.pdflatexpath + " " + a)


        pdfname = [f for f in os.listdir('.') if f.endswith('.pdf')][0]
        os.chdir('..')
        shutil.copy2(tmpdir + '/' + pdfname, '.')
        shutil.rmtree(tmpdir)
        os.chdir(currdir)

    def read_input(self):
        '''
        parses the input file to get the array of knowledge pieces
        :return: void
        '''
        # create a borderline array - keeps the indices of the start and end
        # of each knowledge piece
        lines = open(self.input_file, 'r').readlines()
        bps = [i for i in range(len(lines)) if re.search('\[.*[;].*[;].*\]', lines[i]) != None]

        # using the borderline array, find the actual knowledge pieces
        for i in range(len(bps)):
            start, end = bps[i], len(lines) if i >= len(bps)-1 else bps[i+1]

            # the specifications for the location of the cheatsheet
            profile = [i.strip() for i in lines[start].split(";")]
            if len(profile) != 3:
                self.add_msg("The input must be of format <lang>;<category>;<subcategory>!")
                exit()

            lang, cat, subcat = profile[0][1:], profile[1], profile[2][:-1]

            # the boundaries for the description and code
            bounds = [j for j in range(start,end) if lines[j].find("~~~~") > -1]
            if len(bounds) != 4:
                self.add_msg("~~~~~ is missing somewhere in knowledge block starting at line " + str(start))
                exit()
            desc = [lines[l] for l in range(bounds[0] + 1, bounds[1])]
            code = [lines[l] for l in range(bounds[2] + 1, bounds[3])]
            self.knowledge_piece_array.append((lang, cat, subcat, "".join(desc), "".join(code)))

    def handle_cheatsheet(self, lang):
        # 3. LOAD OR CREATE CHEATSHEET
        ## create new cheatsheet if not exists or
        ## parse the cheatsheet of the language into
        ## map <category>:[content]

        cats_to_content = {}
        # get the lang cheatsheet or create a new one (hash)
        if os.path.isfile(self.wrapdir(lang)):
            cats_to_content = utils.parselang(self.wrapdir(lang))
            self.add_msg('Cheatsheet ' + lang + ' loaded!')
        else:
            # FIX INPUT!!!
            while True:
                userinput = self.get_input('The cheatsheet ' + lang + ' has not been created yet. Would you like a new one?')
                if userinput == "Y":
                    cats_to_content = utils.create_new_lang(lang)
                    break
                elif userinput == "N":
                    self.add_msg('Cheatsheet not created. Knowledge could not be added. Aborting')
                    exit()
        return cats_to_content

    def handle_category(self, cat, cht):
        '''
        Sees whether the category written already exists
        And prompts the user for the action to take if
        it doesn't.
        :param cat: the relevant category
        :param cht: the relevant cheatsheet
        :return: the destined name of the category, boolean to indicate
                 whether an existing category was chosen or not
        '''
        if not cat[0].isupper():
            cat = cat[0].upper() + cat[1:]
        if cat in cht.keys():
            # category has been found and we can move on
            pass
        else:
            # recommend most similar categories or choose new one
            keys = [k for k in cht.keys() if k not in ["START","END"]]
            recommendations = sorted([(i, utils.edit_distance(k, cat)) for i, k in enumerate(keys)], key=itemgetter(1))
            self.add_msg("Category " + cat + " not recognized. Choose one of following:")
            self.add_msg("-1 = add new category")
            for i, rec in recommendations[:min(3, len(keys))]:
                self.add_msg(str(i) + " = " + keys[i])
            inpt = self.get_input('Choice')
            inpt = int(inpt)
            if inpt == -1:
                return cat, False
            else:
                if inpt >= 0 and inpt < len(keys):
                    cat = keys[inpt]
                else:
                    self.add_msg("Invalid choice. Exiting program")
                    exit()
        return cat, True

    def create_current_knowledge_piece(self, cht, lang, cat, desc, code):
        # 6. HANDLE THE NEW KNOWLEDGE

        ## query user for new knowledge to append to the category!
        self.add_msg("Language: " + lang + "; Category:"  + cat)

        beg = desc + "\n"
        beg += "\\tiny{}\n"
        beg += "\\begin{verbatim}\n"
        beg += code + "\n"
        beg += "\\end{verbatim}\n"
        beg += "\\normalsize{}\n"

        return beg

    def get_input(self, message):
        self.gui_setters['setmsg'](message)
        self.gui_setters['set_expecting_input'](True)
        while self.gui_setters['get_expecting_input']() == True:
            time.sleep(0.1)
        return self.gui_setters['get_text_input']()

    def add_msg(self, message):
        self.gui_setters['setmsg'](message)