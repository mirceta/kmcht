## The evolution of this project has moved. The continuation of this project lives in https://github.com/volkmaster/cheatsheet.


WORKING PROTOTYPE

[What is it]
Kmcht is a tool for transforming cheatsheet files to pdfs containing cheatsheets.

A cheatsheet file:
[python;strings;default]
~~~~~
Description
~~~~~
~~~~~
Code
~~~~~

[How to use]
With python 3.4 run gui.py. Set a destination folder of where cheatsheets - 1 .pdf and 1 .tex
will reside. The .tex is needed to add knowledge to an existing cheatsheet. 

If pdflatex is in your path then leave the text field blank, else enter the path to pdflatex. 
Give a path to your knowledge file. (Sample in data/sample.txt)
Run by clicking the button and the messages in the message box will lead you through the usage
of the program.

[Dependencies]
- pdflatex in your path environment variable (mactex)
- python 3.4 in your path environment variable



[Contributing]
- GitHub flow: https://guides.github.com/introduction/flow/

- Distributing work:
We make projects, which contain GitHub issues.
- Main Project
- One project for each major feature

Project workflow:
  1. Research: Discussion of ideas, what can be done, where are the limits,
               what are we going to use, Explore options, what are pluses, minuses,
               Don’t go into details yet. Here we explore options.
  2. Spec: plan of implementation. (Motivation, what are we trying to achieve, details)
  3. Spec Review
  4. Ready for development
  5. Development
  UNIT TESTS (local pass) #TODO how
  LINT #TODO how
  6. Code Review: via pull request, additional product review for GUI etc.
  7. Testing: is everything working?
  8. Deploy
  
  Additional: Every month we do staging - this is testing master. Emphasis is on
	      newly added features.
   
               
  
