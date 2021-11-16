# README for developers

## install nodejs

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    
    source ~/.bashrc
    nvm list-remote
    nvm install v10.24.1 && nvm use v10.24.1 && node -v
    nvm install v12.22.1 && nvm use v12.22.1 && node -v

## build

    npm install
    F5  => npm: watch note-file


## publish

    npm remove vsce && npm install -g vsce@1.103.1
    nvm install v12.22.1 && nvm use v12.22.1

    # toker=735rwqurs4jhc4naz7d257l5zwt73qbmcolf7jiyg3wzhnmmf27a
    vsce login pastoral
    vsce package && vsce publish

## new extension

    // install scalfold generator
    npm install -g yo generator-code
    yo code