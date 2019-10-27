#!/usr/bin/fish
sudo snap install code --classic

set DIR (dirname (readlink -m (status --current-filename)))

ln -si $DIR/cpp-env/.* ~/

# 初回の起動
code
sleep 3
killall code
sleep 1
killall code

mv ~/.vscode ~/.vscode.bak
ln -si $DIR/vscode/home ~/.vscode

ln -si $DIR/vscode/config/* ~/.config/Code/User/
