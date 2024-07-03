import express from "express";
import { Request, Response } from "express";
const employeeRouter = express.Router();

employeeRouter.get("/", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(200).send(" A list of all the employess.... ");
});

employeeRouter.post("/", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(201).send(" New Employee has been added ! ");
});

employeeRouter.put("/:id", (req: Request, res: Response) => {
	const { id } = req.params;
	console.log(id);
	console.log(req.url);
	res.status(201).send(`Updated employee info with id -> ${id}`);
});

employeeRouter.delete("/:id", (req: Request, res: Response) => {
	console.log(req.url);
	res.status(200).send(" Deleted ");
});

export default employeeRouter;
