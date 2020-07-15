#!/usr/bin/env fish
set DIR (dirname (greadlink -m (status --current-filename)))
ln -si $DIR/fish-conf.d/* ~/.config/fish/conf.d/
