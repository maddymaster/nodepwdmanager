console.log('Welcome to password manager.');

// Require crypto to help us encrypt and decrypt passwords.
var crypto = require('crypto-js')

// JSON documents are stored in the file system for persistence. 
// Node-persist uses the HTML5 localStorage API.
var storage = require('node-persist');
// Initialize node-persist.
// https://www.npmjs.com/package/node-persist
storage.initSync();

// We use the Yargs package to pass command line (and HTTP???) arguments to our app.
var argv = require('yargs')
	// .command(the name of our command, a description to use when we call the --help flag)
	.command('create', 'Adds a new password.', function(yargs) {
		yargs.options({ // An object containing all of our command line OPTIONS 
			name: {
				demand: true,
				alias: 'n',
				// description shows when user uses the --help flag.
				description: 'Account name (eg: "Twitter", "Facebook", "Google", etc.)',
				type: 'string'
			},
			username: {
				demand: true,
				alias: 'u',
				description: 'Account username or email',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'Account password',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Master password',
				type: 'string'
			}
		}).help('help'); // Which flag to use when the user wants to call the "help". In this case '--help'.
	})
	// Add another command, 'get'.
	.command('get', 'Gets an existing account and its password.', function(yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Account name (eg: "Twitter", "Facebook", "Google", etc.)',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Master password',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;

/**
* So, we now have some commands and some options for each command. :)
* 
* create
* 	--name
* 	--username
* 	--password
*
* get
* 	--name
**/

// Sets the first argument from the command line via Yargs to the variable "command".
var command = argv._[0];

// A typical argv object might look something like this:
// { 
// 	 _: [ 'hello' ],
//   help: false,
//   n: 'Jonathan',
//   name: 'Jonathan',
//   l: 'Bell',
//   lastname: 'Bell',
//   '$0': '/usr/bin/nodejs example-args.js' 
// }

function getAccounts(masterPassword) {
	// Use getItemSync to fetch accounts.
	var encryptedAccounts = storage.getItemSync('accounts'); // The encrypted list of the accounts. 
	var accounts = []; // This will hold the decrypted accounts list. 

	// Decrypt
	if (typeof encryptedAccounts !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}

	// Return the accounts array.
	return accounts;
}

function saveAccounts(accounts, masterPassword) {
	// Run the accounts through encryption.
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
	
	// We store the encrypted accounts and passwords via the node-persist package.
	storage.setItemSync('accounts', encryptedAccounts.toString());
	
	// Return the accounts string.
	return accounts;
}

function createAccount(account, masterPassword) {
	var accounts = getAccounts(masterPassword);

	// Push the account to the accounts list/array.
	accounts.push(account);
  // Call saveAccounts() in order to save this account. 
	saveAccounts(accounts, masterPassword);

	return account;
}

// Gets a single account. Not to be confused with getAccounts().
function getAccount(accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;

	accounts.forEach(function(account) {
		if (account.name === accountName) {
			matchedAccount = account;
		}
	}); // forEach()

	return matchedAccount;
}

// Our two commands: create & get.
if (command === 'create') {
	try {
		var createdAccount = createAccount({
			// Use the Yargs package to get the values from the command line and assign the values to this object.
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('Account created!');
		console.log(createdAccount); // Show the user the created account.
	} catch (e) {
		console.log('An error occured while trying to create the account.');
	}
} else if (command === 'get') {
	try {
		var fetchedAccount = getAccount(argv.name, argv.masterPassword);
		if (typeof fetchedAccount === 'undefined') {
			console.log('Account not found.');
		} else {
			console.log('Account found!');
			console.log(fetchedAccount); // Show the user the found account.
		}
	} catch (e) {
		console.log('An error occured while trying to fetch the account.');
	}
} else {
	console.log('Not a valid command. Use the "--help" flag (node app.js --help) for more information.');
}
