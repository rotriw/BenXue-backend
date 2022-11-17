const fs = require("fs")
const chalk = require("chalk")
var log4js = require('log4js');
const packages = fs.readdirSync("../packages/");

const express = require("express");
const { exit } = require("process");
var mongodb = require('mongodb').MongoClient;


async function run() {
	let configs;
	try {
		configs = JSON.parse(fs.readFileSync("../control.json"));
	} catch (err) {
		console.log(chalk.red("read config error."))
		console.log(err)
		exit(1);
	}

	let web, weblisten, db, dbname;

	var url = configs.db;
	function connectDB() {
		return new Promise(resolve => {
			mongodb.connect(url, function (err, db) {
				resolve({ "err": err, "db": db });
			});
		});
	}
	dbo = await connectDB();
	if (dbo.err) {
		console.log(dbo.err);
	}
	db = dbo.db;
	dbname = configs.dbname;
	try {
		web = new express();
		web.all("*", function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
			res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
			next();
		});
		weblisten = web.listen(configs.port);
	} catch (err) {
		console.log(chalk.red("启动网络失败"))
		console.log(err)
		exit(1);
	}
	console.log(chalk.green("启动" + chalk.bold("网络") + "成功"))

	for (const package of packages) {
		let requires = JSON.parse(fs.readFileSync("../packages/" + package + "/requireValue.json"));
		let val = require("../packages/" + package);
		let command = "val.default(";
		for (var i = 0; i < requires.length - 1; i++) {
			command += requires[i] + ",";
		}
		// console.log(requires.length);
		command += requires[requires.length - 1] + ")";
		// console.log(command);
		try {
			eval(command);
			console.log(chalk.green(chalk.bold(package) + "组件 启动完成"));
		} catch (err) {
			console.log(chalk.red(chalk.bold(package) + "组件 启动失败"));
			console.log(err);
		}
	}
}
run();