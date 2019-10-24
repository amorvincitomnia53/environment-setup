#!/usr/bin/fish
sudo apt install terminator

set DIR (dirname (readlink -m (status --current-filename)))
ln -si $DIR/terminator-config ~/.config/terminator

