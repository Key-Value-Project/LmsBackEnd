import express from "express";
import { Request, Response } from "express";
import employeeRouter from "./Routes/employeeRouter";

const server = express();
server.use("/employee", employeeRouter);


server.get("/", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(200).send(" Root URL ");
});

server.listen(3000, () => {
	console.log("server is running on port 3000");
});
