#!/usr/bin/env fish
brew install terminator

set DIR (dirname (greadlink -m (status --current-filename)))
ln -si $DIR/terminator-config ~/.config/terminator

