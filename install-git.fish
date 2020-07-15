#!/usr/bin/env fish
brew install git

set DIR (dirname (greadlink -m (status --current-filename)))
ln -si $DIR/git/gitconfig ~/.gitconfig
ln -si $DIR/git/git-format-diff.sh ~/.git-format-diff.sh
ln -si $DIR/git/git-template ~/.git-template
ln -si $DIR/git/gitignore-global ~/.gitignore-global



