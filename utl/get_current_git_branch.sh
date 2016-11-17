#!/bin/sh
BRANCH=`git branch | grep "^* [a-zA-Z]" | cut -c 3- ` 
SANE_BRANCH_NAME=`echo $BRANCH | grep '^[a-zA-Z0-9_/-]\+$'`
if [ $SANE_BRANCH_NAME ]
then
    echo $BRANCH
else
    echo next
fi
