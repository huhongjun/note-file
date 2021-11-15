# README

mcr.microsoft.com/vscode/devcontainers/repos/microsoft/vscode

## install nodejs

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    
    source ~/.bashrc
    nvm list-remote
    nvm install v10.24.1 # 11.13,10.12
    nvm list
    nvm use v10.24.1
    nvm install v12.22.1 && nvm use v12.22.1
    node -v

## build

    npm install
    F5  => New Window => => Ctrl+Shift+P = > Hello Worl , Command 2


## new extension

    // 安装脚手架
    npm install -g yo generator-code
    yo code

    npm remove vsce && npm install -g vsce@1.103.1
    vsce package 
    vsce publish

    vsce login Pastoral #token=qj2ijxgavqzznbl2ye3h4gzaam44qqedxfojioz75uuvs4qishnq
    vsce create-publisher pastoral
    // 增量发布， 版本号：major.minor.patch
    vsce publish patch
    vsce publish minor
    vsce publish major
    vsce unpublish (publisher name).(extension name)

## memo

	// "onCommand:note-file.helloWorld"