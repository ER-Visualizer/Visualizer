#!/bin/bash
file="./frontend/.env"
if [ -f $file ] ; then
    rm $file
fi
for line in `sed '/^$/d' $1`; do
    key_value=$(echo $line | tr "=" "\n")
    index=0
    res="REACT_APP_"
    skip=0
    for k in $key_value:
    do
        if [[ $k == "REACT_APP"* ]]; then
            skip=1
            break;
        fi
        res+="$k"
        ((index++))
        if [ $index -lt 2 ];
        then
            res+="="
        fi
    done
    if [ $skip = 1 ]; then
        continue;
    fi
	echo "$res" | sed 's/.$//'
	echo "$res" | sed 's/.$//' >> "$file"
done
echo "REACT_APP_DEV_ENV=$DEV_ENV" >> "$file"