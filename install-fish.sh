#!/bin/sh
sudo apt-add-repository ppa:fish-shell/release-3
sudo apt update
sudo apt install fish -y
chsh -s /usr/bin/fish

(dirname (status -f))/install-fish-extension.fish