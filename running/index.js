const fs = require("fs")
const chalk = require("chalk")
var log4js = require('log4js');
const packages = fs.readdirSync("../packages/");

const express = require("express");
const { exit } = require("process");
let configs;
try {
	configs = JSON.parse(fs.readFileSync("../control.json"));
} catch(err) {
	console.log(chalk.red("read config error."))
	console.log(err)
	exit(1);
}

let web, weblisten;

try {
	web = new express();
	weblisten = web.listen(configs.port);
} catch(err) {
	console.log(chalk.red("启动网络失败"))
	console.log(err)
	exit(1);
}
console.log(chalk.green("启动"+chalk.bold("网络")+"成功"))

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
	}
}