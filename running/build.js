const chalk = require("chalk");
const fs = require("fs")
const os = require("os");
const ch = require("child_process");
const packages = fs.readdirSync("../packages/");

for (const package of packages) {
	let command = "cd ../packages/" + package + " && yarn run build";
	try {
		ch.exec(command, (err, stdout, stderr) => {
			if (err) {
				console.log(chalk.red(chalk.bold(package) + "组件编译失败"));
				console.log(err);
				console.log(`stdout: ${stdout}`);
				return;
			}
			console.log(chalk.green(chalk.bold(package) + "组件编译完毕"));
			
			// console.log(`stderr: ${stderr}`);
		})
		ch.exec(command);
	} catch (err) {
		console.log(err);
	}
}