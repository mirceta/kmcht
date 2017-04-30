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

exports.existsCheatsheet = function(conn) {
	var sql = `
		SELECT TOP 1 [PK_id]
		FROM [kmcht_test].[dbo].[KnowledgePiece]
	`;
	var request = new ted.Request(sql, function(err, rowCount) {
		if (err) { console.log(err); }
		else {
			if (rowCount > 0) {
				return true;
			} return false;
		}
	});
	conn.execSql(request);
}