#!/usr/bin/env fish

# brew install curl

#fisher
curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish

#theme-bobthefish
fisher add oh-my-fish/theme-bobthefish

#z
fisher add jethrokuan/z

#fzf
if not test -d ~/.fzf
	git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
	~/.fzf/install
end
fisher add fzf

#edc/bass
fisher add edc/bass

fisher add 0rax/fish-bd

fisher add oh-my-fish/plugin-balias

fisher add oh-my-fish/plugin-expand

fisher add oh-my-fish/plugin-peco
fisher add oh-my-fish/plugin-extract

#symlink fish-conf.d
eval fish (dirname (status -f))/link-fish-confs.fish
