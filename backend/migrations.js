var ted = require('tedious');

// create database
exports.createDatabase = function(conn) {
	var sql = `
	USE master
	IF NOT EXISTS(select * from sys.databases where name='kmcht_test') 
	CREATE DATABASE [kmcht_test]

	use [kmcht_test]

	  IF OBJECT_ID('dbo.Cheatsheet', 'U') IS NULL
		CREATE TABLE Cheatsheet (
			PK_CheatsheetId int not null identity(1,1) primary key,
			Lang varchar(50)
		)

	  IF OBJECT_ID('dbo.KnowledgePiece', 'U') IS NULL
		CREATE TABLE KnowledgePiece (
			PK_id int not null identity(1,1) primary key,
			FK_CheatsheetId int not null,
			CodeDescription varchar(MAX),
			Code varchar(MAX)
		)
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
		if (err) { console.log(err); }
		else {console.log(rowCount + ' rows');}
	});
	request.on('row', function(columns) {
		console.log('There is data');
	});
	conn.execSql(request);
}

// exists ops
exports.existsCheatsheet = function(conn, lang, exists, notexists) {
	var sql = `
		SELECT [PK_CheatsheetId], [Lang]
		FROM [kmcht_test].[dbo].[Cheatsheet]
		WHERE [Lang] = '` + lang + `' 
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
		if (err) { console.log(err); }
		else {
			
		}
	});
	
	var ext = null;
	request.on('row', function(columns) {
    columns.forEach(function(column) {
      if (column.value == lang) {
        ext = columns[0].value;
      } 
    });
  });

	request.on('requestCompleted', function() {
		if (ext != null) {
			console.log('ExistsCheatsheet done: calling exists');
			exists(ext);
		} else {
			console.log('ExistsCheatsheet done: calling notexists');
			notexists();
		}
	});

	conn.execSql(request);
}

// insert ops
exports.insertCheatsheet = function(conn, lang, then) {
	var sql = `
		USE [kmcht_test]		

		INSERT INTO [dbo].[Cheatsheet]
							([Lang])
		VALUES
							('` + lang + `')
		select scope_identity()
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
		if (err) { console.log(err); }
		else {
		}
	});

	var data = null;
	request.on('row', function(columns) {
    columns.forEach(function(column) {
      data = column.value;
    });
  });
	request.on('requestCompleted', function() {
		if (data != null) {
			console.log('InsertCheatsheet done: calling then(' + data + ')');
			then(data);
		}
	});

	conn.execSql(request);
}

exports.insertKnowledgePiece = function(conn, langid, code, desc) {
	var insrt = function() {
		var sql = `
		USE [kmcht_test]

		INSERT INTO [dbo].[KnowledgePiece]
							([FK_CheatsheetId]
							,[CodeDescription]
							,[Code])
				VALUES
							(` + langid + `
							,'` + code + `'
							,'` + desc + `')
		`;
		var request = new ted.Request(sql, function(err, rowCount) {
			if (err) { console.log(err); }
			else {
				console.log('Inserted Knowledge piece');
			}
		});
		conn.execSql(request);
	};
	insrt();
}

// update ops
exports.updateCheatsheet = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		UPDATE [dbo].[Cheatsheet]
			SET [PK_CheatsheetId] = <PK_CheatsheetId, uniqueidentifier,>
					,[Lang] = <Lang, varchar(50),>
		WHERE <Search Conditions,,>
		GO
	`;
}

exports.updateKnowledgePiece = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		UPDATE [dbo].[KnowledgePiece]
			SET [PK_id] = <PK_id, uniqueidentifier,>
					,[FK_CheatsheetId] = <FK_CheatsheetId, int,>
					,[CodeDescription] = <CodeDescription, varchar(1),>
					,[Code] = <Code, varchar(1),>
		WHERE <Search Conditions,,>
		GO
	`;
}

// delete ops
exports.deleteCheatsheet = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		DELETE FROM [dbo].[Cheatsheet]
					WHERE <Search Conditions,,>
		GO
		`;
}

exports.deleteKnowledgePiece = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		DELETE FROM [dbo].[KnowledgePiece]
					WHERE <Search Conditions,,>
		GO
	`;
}

// select ops
exports.selectCheatsheet = function(conn, lang, then) {
	var sql = `
		USE [kmcht_test]

		SELECT [PK_CheatsheetId]
					,[Lang]
			FROM [dbo].[Cheatsheet] `;
		/*if (lang != null) 
		  sql += "WHERE [Lang] = '" + lang + "' ";
		sql += ` `;*/
	var request = new ted.Request(sql, function(err, rowCount) {
			if (err) { console.log(err); }
	});

	data = [];
	request.on('row', function(columns) {

		dat = {};
    columns.forEach(function(column) {
      dat[column.metadata.colName] = column.value;
    });
		data.push(dat);

  });

	request.on('requestCompleted', function() {
		if (data != null) {
			console.log('returning ' + data.length + ' rows');
			then(data);
		}
	});

	conn.execSql(request);
}

exports.selectKnowledgePiece = function(conn, then) {
	var sql = `
		USE [kmcht_test]

		SELECT [PK_id]
					,c.[Lang]
					,[CodeDescription]
					,[Code]
		FROM [dbo].[KnowledgePiece] kp, [dbo].[Cheatsheet] c
		WHERE kp.FK_CheatsheetId = c.PK_CheatsheetId
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
			if (err) { console.log(err); }
	});

	data = [];
	request.on('row', function(columns) {
		
		dat = {};
    columns.forEach(function(column) {
      dat[column.metadata.colName] = column.value;
    });
		data.push(dat);

  });

	request.on('requestCompleted', function() {
		if (data != null) {
			console.log('returning ' + data.length + ' rows');
			then(data);
		}
	});

	conn.execSql(request);
}