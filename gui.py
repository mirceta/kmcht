import tkinter as tk
import kmcht_tools as km
import json
import os
from tkinter.filedialog import askopenfilename
from tkinter.filedialog import askdirectory
from threading import Thread

name_to_widget = {}

root = tk.Tk()
## string vars
msg = tk.StringVar(root)
msg.set("Log.")
engine_executed = False
expecting_input = False
text_input = ''
#################
## definitions

def set_expecting_input(val):
    global expecting_input
    expecting_input = val
def get_expecting_input():
    global expecting_input
    return expecting_input
def get_text_input():
    global text_input
    return text_input

def delegate_setmsg(text):
    str = msg.get().split('\n')
    if len(str) > 10:
        msg.set('\n'.join(str[1:]) + '\n' + text)
    else:
        msg.set('\n'.join(str) + '\n' + text)


def func():
    global engine_executed
    if engine_executed:
        return

    a = name_to_widget['tf_input'].get()
    b = name_to_widget['tf_chtdir'].get()
    pdfltx = name_to_widget['tf_pdflatex'].get()
    abool, bbool = True, True
    if not os.path.isfile(a):
        msg.set("The path to the input file is not a file.")
        abool = False
    if not os.path.isdir(b):
        msg.set("The path to the cheatsheet directory is not a directory.")
        bbool = False
    if abool and bbool:
        msg.set("Everything is set for execution!")

        # execute the engine!
        engine_executed = True
        hsh = {}
        hsh['setmsg'] = delegate_setmsg
        hsh['root'] = root
        hsh['set_expecting_input'] = set_expecting_input
        hsh['get_expecting_input'] = get_expecting_input
        hsh['get_text_input'] = get_text_input
        engine = km.CheatsheetEngine(inputfl=a,chtdir=b,guis=hsh,pdflatexpath=pdfltx)
        brt = lambda: engine.start()
        thread = Thread(target = brt)
        thread.start()



###############################################
## Callbacks
def callback_tf_userin(event):
    global expecting_input
    global text_input
    text_input = event.widget.get()
    expecting_input = False
    event.widget.delete(0,1000)

def support_fun_tf(event):
    file = askopenfilename()
    event.widget.delete(0,1000)
    event.widget.insert(0, file)
    return file

def callback_input_click(event):
    file = askopenfilename()
    event.widget.delete(0,1000)
    event.widget.insert(0, file)

def callback_dir_click(event):
    file = askdirectory()
    event.widget.delete(0,1000)
    event.widget.insert(0, file)
    a = json.load(open('data/config.txt', 'r'))
    a['directory'] = file
    json.dump(a, open('data/config.txt', 'w'))


###############################################
## code

# widget work

# set up the frames
upper = tk.Frame()
upper.pack()
middle = tk.Frame()
middle.pack()
lower = tk.Frame()
lower.pack()

# labels
l_chtdir = tk.Label(upper, text='Cheatsheet directory')
l_chtdir.pack(side=tk.LEFT)

l_input = tk.Label(middle, text='Input file')
l_input.pack(side=tk.LEFT)

# textfields
tf_chtdir = tk.Entry(upper, width=40)
tf_chtdir.pack(side=tk.LEFT)
tf_chtdir.bind('<Button-1>', callback_dir_click)
name_to_widget['tf_chtdir'] = tf_chtdir

tf_input = tk.Entry(middle, width=40)
tf_input.pack(side=tk.LEFT)
tf_input.bind('<Button-1>', callback_input_click)
name_to_widget['tf_input'] = tf_input

# pdf latex
tf_pdflatex = tk.Entry(upper, width=40)
tf_pdflatex.insert(0, "/Library/TeX/texbin/pdflatex")
tf_pdflatex.pack(side=tk.RIGHT)
l_pdflatex = tk.Label(upper, text='PdfLaTeX tool path')
l_pdflatex.pack(side=tk.RIGHT)
name_to_widget['tf_pdflatex'] = tf_pdflatex


# buttons
btn = tk.Button(middle, text='OK', command=func)
btn.pack(side=tk.BOTTOM)

# message box
msg_log = tk.Message(lower, textvariable=msg, width=500)
msg_log.pack(side=tk.LEFT)
name_to_widget['msg_log'] = msg_log

# user input text field
tf_userin = tk.Entry(lower)
tf_userin.pack(side=tk.RIGHT)
tf_userin.focus()
tf_userin.bind('<Return>', callback_tf_userin)



#################
## presets for running

## navigate to the directory where the tool resides
prev_dir = os.getcwd()
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

## 1. VERIFY OR SET CONFIGURATION
# verify correctness of config file and parse the config
# retrieve directory of cheatsheets
# the config file exists
fconfig = "data/config.txt"
if os.path.isfile(fconfig):
    conf = json.load(open(fconfig, 'r'))
    directory = conf['directory']
    tf_chtdir.insert(0,os.path.abspath(directory))

root.mainloop()