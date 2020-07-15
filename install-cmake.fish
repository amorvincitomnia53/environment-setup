#!/usr/bin/env fish
wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | brew-key add -
brew-add-repository 'deb https://apt.kitware.com/ubuntu/ bionic main'
brew update
brew install kitware-archive-keyring
brew-key --keyring /etc/apt/trusted.gpg del C1F34CDD40CD72DA
brew install cmake 
