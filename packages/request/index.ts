import * as express from "express"
import { zhixue } from "./request"
import * as bodyParser from "body-parser"

export default function (app: express.Express) {
	try {
		app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

		app.all("*", function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
			res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
			next();
		});
		
		app.post("/pwdencrypt", async (req, res) => {
			res.send(await zhixue.login(req.body.username, req.body.password));
		});

		app.post("/vertify", (req, res) => []);

		app.get("/status", async (req, res) => {
			res.send({ status: "正常运行中", color: "green" });
		});

		app.post("/getexamlist", async (req, res) => {
			res.send(await zhixue.getExemList(req.body.token, req.body.childId, req.body.pageIndex, req.body.pageSize, req.body.reportType));
		});

		app.post("/getexaminfo", async (req, res) => {
			res.send(await zhixue.getExemInfo(req.body.token, req.body.childId, req.body.examid));
		});

		app.post("/getclassrank", async (req, res) => {
			res.send(await zhixue.getSubjectDiagnosisRank(req.body.token, req.body.childId, req.body.examid));
		});

		app.post("/getlevel", async (req, res) => {
			res.send(await zhixue.getLevelTrendByMain(req.body.token, req.body.childId, req.body.examid));
		});
	} catch (err) {
		return err;
	}
	return 0;
}