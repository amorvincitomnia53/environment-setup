#!/bin/sh
brew install fish
chsh -s /usr/bin/fish

$(dirname (status -f))/install-fish-extension.fish
