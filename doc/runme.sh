#!/bin/sh

set -e

for dir in $(ls recipes)
do
    cd recipes/$dir
    sh runme.sh
    cd -
done
