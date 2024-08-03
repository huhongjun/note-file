# README for developers

## install nodejs

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source ~/.bashrc
    
    nvm list-remote
    nvm install v10.24.1 && nvm use v10.24.1 && node -v
    nvm install v12.22.1 && nvm use v12.22.1 && node -v

## build

    npm install

## debug

    Run and Debug -> Launch Extension (note-file) -> Open vscode host instance
    open folder include .vscode/file-notes.json

## publish

    npm remove vsce && npm install -g vsce@1.103.1
    nvm install v12.22.1 && nvm use v12.22.1

    # PersonalAccessToken: *
    vsce login pastoral
    npm install -g vsce
    vsce package && vsce publish
