#!/bin/bash
file="./frontend/.env"
if [ -f $file ] ; then
    rm $file
fi
for line in `sed '/^$/d' $1`; do
    key_value=$(echo $line | tr "=" "\n")
    index=0
    res="REACT_APP_"
    for k in $key_value:
    do
    	res+="$k"
    	((index++))
    	if [ $index -lt 2 ];
    	then
    		res+="="
    	fi
	done
	echo "$res" | sed 's/.$//'
	echo "$res" | sed 's/.$//' >> "$file"
done
echo "REACT_APP_DEV_ENV=$DEV_ENV" >> "$file"