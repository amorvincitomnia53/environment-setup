files=`find "$1" -maxdepth ${2-1} -iname \*.hpp -o -iname \*.cpp -o -iname \*.c -o -iname \*.h`
echo $files | tr " " "\n"
echo $files | xargs clang-format -i

