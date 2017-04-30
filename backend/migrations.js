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
			PK_CheatsheetId uniqueidentifier primary key,
			Lang varchar(50)
		)

	  IF OBJECT_ID('dbo.KnowledgePiece', 'U') IS NULL
		CREATE TABLE KnowledgePiece (
			PK_id uniqueidentifier primary key,
			FK_CheatsheetId int not null,
			CodeDescription varchar,
			Code varchar
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
exports.existsCheatsheet = function(conn) {
	var sql = `
		SELECT TOP 1 [PK_id]
		FROM [kmcht_test].[dbo].[KnowledgePiece]
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
		if (err) { console.log(err); }
		else {
			if (rowCount > 0) {
				console.log("Some exist, yes");
			} else {
				console.log("No man, sadly");
			}
			
		}
	});
	conn.execSql(request);
}

// insert ops
exports.insertCheatsheet = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		INSERT INTO [dbo].[Cheatsheet]
							([PK_CheatsheetId]
							,[Lang])
				VALUES
							(<PK_CheatsheetId, uniqueidentifier,>
							,<Lang, varchar(50),>)
		GO
	`;
}

exports.insertKnowledgePiece = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		INSERT INTO [dbo].[KnowledgePiece]
							([PK_id]
							,[FK_CheatsheetId]
							,[CodeDescription]
							,[Code])
				VALUES
							(<PK_id, uniqueidentifier,>
							,<FK_CheatsheetId, int,>
							,<CodeDescription, varchar(1),>
							,<Code, varchar(1),>)
		GO
	`;
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
exports.selectCheatsheet = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		SELECT [PK_CheatsheetId]
					,[Lang]
			FROM [dbo].[Cheatsheet]
		GO
	`;
}

exports.selectKnowledgePiece = function(conn) {
	var sql = `
		USE [kmcht_test]
		GO

		SELECT [PK_id]
					,[FK_CheatsheetId]
					,[CodeDescription]
					,[Code]
			FROM [dbo].[KnowledgePiece]
		GO
	`;
}