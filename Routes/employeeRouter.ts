import express from "express";
import { Request, Response } from "express";
import Employee from "../Schema/Employee";
import AppdataSource from "../Database/data-source";

const employeeRouter = express.Router();

let count = 2; // for id

// Routes
employeeRouter.get("/", async (req: Request, res: Response) => {
	const employeeRepositry = AppdataSource.getRepository(Employee);
	const employees = await employeeRepositry.find();
	res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const employeeRepositry = AppdataSource.getRepository(Employee);
	const employee = await employeeRepositry.findOneBy({ id: Number(id) });
	res.status(200).send(employee);
});

employeeRouter.post("/", async (req: Request, res: Response) => {
	const queryRunner = AppdataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();
	try {
		const employee = new Employee();
		// const employeeRepositry = AppdataSource.getRepository(Employee);
		employee.name = req.body.name;
		employee.email = req.body.email;
		const response = await queryRunner.manager.save(employee);
		await queryRunner.commitTransaction();
		res.status(201).send(`Employee created with id -> ${response.id} \n ${response}`);
	} catch (e) {
		await queryRunner.rollbackTransaction();
		res.status(500).send(e);
	} finally {
		await queryRunner.release();
	}
});

employeeRouter.put("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const employeeRepositry = AppdataSource.getRepository(Employee);
	const employee = await employeeRepositry.findOne({
		where: { id: Number(id) },
	});
	employee.name = req.body.name;
	employee.email = req.body.email;
	const response = await employeeRepositry.save(employee);
	res.status(201).send(response);
});

employeeRouter.delete("/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	const employeeRepositry = AppdataSource.getRepository(Employee);
	const response = await employeeRepositry.softDelete({ id: Number(id) });
	res.status(200).send(response);
});

export default employeeRouter;
