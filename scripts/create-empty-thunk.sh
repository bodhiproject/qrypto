#!/bin/bash

prefix='./dist/commons.'
suffix='.js'

for commonsThunkFileName in \
all \
exclude-background \
exclude-contentscript \
exclude-popup \
exclude-inpage \
background-contentscript \
background-popup \
background-inpage \
contentscript-popup \
contentscript-inpage \
popup-inpage
do
  filePath=$prefix$commonsThunkFileName$suffix;
  if [ ! -f $filePath ]; then touch $filePath; fi
done
