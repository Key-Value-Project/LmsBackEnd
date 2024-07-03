import express from "express";
import { Request, Response } from "express";
import loggerMiddleware from "./Middleware/loggerMiddleware";
import employeeRouter from "./Routes/employeeRouter";
import AppdataSource from "./Database/data-source";

const server = express();
server.use(loggerMiddleware);
server.use(express.json());
server.use("/employee", employeeRouter);

server.get("/", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(200).send(" Root URL ");
});

(async () => {
	try {
		await AppdataSource.initialize();
	} catch (e) {
		console.log("Failed", e);
		process.exit(1);
	}
	server.listen(3000, () => {
		console.log("server listening to 3000");
	});
})();
