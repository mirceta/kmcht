var ted = require('tedious');
var mig = require('./migrations');
var express = require('express');
var app = express();

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

// REST
app.get('/insertKnowledge', function (req, res) {
  // connect
  var connection = new ted.Connection(config);
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successful');
      var lang = req.query.lang;
      var code = req.query.code;
      var desc = req.query.desc;
      mig.existsCheatsheet(connection, lang,
                                  function(id) {
                                    mig.insertKnowledgePiece(connection, 
                                              id, code, desc);
                                  }, 
                                  function() {
                                    mig.insertCheatsheet(connection, lang,
                                      function(id) {
                                        mig.insertKnowledgePiece(connection,
                                          id, code, desc);
                                      }
                                    )
                                  })
    }
  });
})

app.get('/insertCheatsheet', function (req, res) {
  // connect
  var connection = new ted.Connection(config);
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successful');
      var lang = req.query.lang;
      mig.existsCheatsheet(connection, lang,
                                  function(id) {
                                    res.end('cheatsheet exists');
                                  }, 
                                  function() {
                                    mig.insertCheatsheet(connection, lang,
                                      function(id) {
                                        res.end('successful');
                                      }
                                    )

                                  })
    }
  });
})

app.get('/getCheatsheets', function (req, res) {
  // connect
  var connection = new ted.Connection(config);
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successful');
      mig.selectCheatsheet(connection, '', function(data) {
        res.end(JSON.stringify(data));
      });
    }
  });
})

app.get('/getKnowledgePieces', function (req, res) {
  // connect
  var connection = new ted.Connection(config);
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successful');
      mig.selectKnowledgePiece(connection, function(data) {
        res.end(JSON.stringify(data));
      });
    }
  });
})

// CREATE DATABASE AND LISTEN
var connection = new ted.Connection(config);
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('successful');
      mig.createDatabase(connection);
    }
  });

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})