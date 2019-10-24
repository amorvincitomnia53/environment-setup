#!/usr/bin/fish
set DIR (dirname (readlink -m (status --current-filename)))
ln -si $DIR/fish-conf.d/* ~/.config/fish/conf.d/