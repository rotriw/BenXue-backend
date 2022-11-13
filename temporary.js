const { exec, execSync } = require('child_process');

exec("cd packages/request && tsc");

const express = require("express");
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
	next()
})

require("./packages/request").default(app);

const port = 6950
app.listen(port, () => {
	
})