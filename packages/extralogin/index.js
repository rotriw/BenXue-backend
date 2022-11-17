var express = require("express");
var mongodb = require("mongodb");
var mongoC = require("mongodb").MongoClient;
const { zhixue } = require("../request/request")
const bodyParser = require("body-parser");

/**
 * 
 * @param {mongoC} db 
 * @param {*} username 
 */
exports.findUserName = async function (dbname, db, username) {
	var dbo = db.db(dbname);
	let Ccoll = await dbo.collection("extralogin");
	let res = await Ccoll.find({ "username": username}).toArray()
	return res;
}

/**
 * 
 * @param {mongoC} db 
 * @param {*} username 
 */
exports.findUserid = async function (dbname, db, userid) {
	var dbo = db.db(dbname);
	let Ccoll = await dbo.collection("extralogin");
	let res = await Ccoll.find({ "userid": userid }).toArray()
	return res;
}


/**
 * @note Attention: 请注意该函数不检查是否已经存在username.
 * @param {mongoC} db 
 * @param {*} username 
 */
exports.UpdateUserName = async function (dbname, db, username, userid) {
	var dbo = db.db(dbname);
	let Ccoll = await dbo.collection("extralogin");
	await Ccoll.deleteOne({ "userid": userid });
	Ccoll.insertOne({ "username": username, "userid": userid});
}

exports.RequstUpdateUserName = async function (dbname, db, username, userid) {
	let findOld = await exports.findUserName(dbname, db, username);
	if (findOld.length > 0) {
		return {
			"status": "-1",
			"error": "This username is exist",
		}
	}
	try {
		await exports.UpdateUserName(dbname, db, username, userid);
		return {
			"status": "0",
			"error": "success"
		}
	} catch {
		return {
			"status": "-1",
			"error": "server error"
		}
	}
}

async function LoginByAll(db, dbname, username, password) {
	var sx = await exports.findUserName(dbname, db, username);
	let res, realUserName;
	if (sx.length == 0) {
		realUserName = username;
	} else {
		username = sx[0].userid;
	}
	res = await zhixue.login(username, password);
	return res;
}
exports.LoginByAll = LoginByAll;

/**
 * 
 * @param {*} db 
 * @param {express.Express} web 
 */
exports.default = function (db, dbname, app) {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	// console.log(db);
	// console.log(dbname);
	app.post("/loginbyall", async (req, res) => {
		res.send(await exports.LoginByAll(db, dbname, req.body.username, req.body.password));
	});
	app.post("/updateuser", async (req, res) => {
		res.send(await exports.RequstUpdateUserName(dbname, db, req.body.username, req.body.userid));
	});
	app.post("/queryuser", async (req, res) => {
		res.send(await exports.findUserid(dbname, db, req.body.userid));
	});
}