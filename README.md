Node Password Manager
=====================

A command line password manager written in Node.

Please don't actually use this to manage your passwords. This is just a pet project. Thanks :) 

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
