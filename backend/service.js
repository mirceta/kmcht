var ted = require('tedious');
var mig = require('./migrations');

console.log('required tedious');

var config = {
  userName: 'kmcht', // update me
  password: 'kurackurac123', // update me
  server: 'kmonster.ddns.net',
  options:
	{
	database: 'kmcht_test',
	port: '49173',
	encrypt: true
	}
}


// connect
var connection = new ted.Connection(config);
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('successful');
  }
});
