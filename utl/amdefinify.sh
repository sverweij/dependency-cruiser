#!/bin/sh
mv $1 $1.tmp
cat ./utl/amdefine.snippet $1.tmp > $1
rm $1.tmp
