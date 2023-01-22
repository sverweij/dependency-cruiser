#!/bin/sh

set -e

for dir in recipes/*
do
    cd "$dir"
    sh runme.sh
    cd -
done
