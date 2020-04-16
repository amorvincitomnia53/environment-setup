files1=`git diff --cached --name-only --diff-filter=AM --ignore-submodules | grep -E "\.cpp$|\.hpp$"`
files2=`git diff --name-only --diff-filter=AM --ignore-submodules | grep -E "\.cpp$|\.hpp$"` 
files="$files1 $files2"
echo formatting...
echo $files | tr " " "\n"
echo $files | xargs clang-format -i

git add $files
