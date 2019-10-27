#!/usr/bin/fish
sudo add-apt-repository ppa:ubuntu-toolchain-r/ppa
sudo apt update

function read_confirm
  while true
    read -l -P 'Do you want to continue? [Y/n] ' confirm

    switch $confirm
      case '' Y y
        return 0
      case N n
        return 1
    end
  end
end

set GCC_LATEST_VERSION_NUM (string match -r '^gcc-([0-9.]*) ' (apt-cache search gcc-) | awk 'NR%2==0' | sort -n | tail -1)
set CLANG_FORMAT_LATEST_VERSION_NUM (string match -r '^clang-format-([0-9.]*) ' (apt-cache search clang-format-) | awk 'NR%2==0' | sort -n | tail -1)

echo "Installing gcc-$GCC_LATEST_VERSION_NUM, g++-$GCC_LATEST_VERSION_NUM, clang-format-$CLANG_FORMAT_LATEST_VERSION_NUM, make, cmake, gdb, libeigen3-dev."
read_confirm
sudo apt install gcc-$GCC_LATEST_VERSION_NUM g++-$GCC_LATEST_VERSION_NUM clang-format-$CLANG_FORMAT_LATEST_VERSION_NUM make cmake gdb libeigen3-dev

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-$GCC_LATEST_VERSION_NUM 20 
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-$GCC_LATEST_VERSION_NUM 20 
sudo update-alternatives --install /usr/bin/cc cc /usr/bin/gcc 30 
sudo update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++ 30
sudo update-alternatives --set cc /usr/bin/gcc
sudo update-alternatives --set c++ /usr/bin/g++

sudo update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-$CLANG_FORMAT_LATEST_VERSION_NUM 30

set DIR (dirname (readlink -m (status --current-filename)))
ln -si $DIR/cpp-env/.* ~/

sudo ln -si eigen3/Eigen /usr/include/Eigen





