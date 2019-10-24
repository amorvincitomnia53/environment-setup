#!/usr/bin/fish

#fisher
curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish

#theme-bobthefish
fisher add oh-my-fish/theme-bobthefish

#z
fisher add jethrokuan/z

#fzf
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf ~/.fzf/install
~/.fzf/install

#edc/bass
fisher add edc/bass

fisher add 0rax/fish-bd

fisher add oh-my-fish/plugin-balias

#symlink fish-conf.d
(dirname (status -f))/link-fish-confs.fish