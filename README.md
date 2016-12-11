Node Password Manager
=====================

A command line password manager written in Node.

This is a pet project altough you could probably use it in real life. There is no warranty. See LICENCE file for more information. Thanks :) 

## Usage

### Install

```git clone https://github.com/jonathanbell/password-manager.git```

```cd password-manager```

```npm install```

### Adding a Password

```node app.js create --name Facebook --username MyFacebookUserName --password MyFacebookPassword -m MyMasterPassword```

Use your master password with _every_ command (other than help) via the ```-m``` or ```--masterPassword``` option flag. 

### Getting a Password

```node app.js get --name Facebook -m MyMasterPassword```

### Help

Help is available via the ```--help``` flag.

Use it like: ```node app.js --help``` or ```node app.js create --help``` or ```node app.js get --help```
