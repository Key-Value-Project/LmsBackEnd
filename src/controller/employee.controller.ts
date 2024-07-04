import EmployeeService from "../service/employee.service";
import express from "express";
import { Request, Response } from "express";

class EmployeeController {
	private employeeService: EmployeeService;
	public router: express.Router;

	constructor() {
		this.employeeService = new EmployeeService();
		this.router = express.Router();

		this.router.get("/", this.getAllEmployees);
		this.router.get("/:id", this.getEmployeeById);
		this.router.post("/", this.createEmployee);
		this.router.delete("/:id", this.deleteEmployee);
	}

	public getAllEmployees = async (req: Request, res: Response) => {
		const employees = await this.employeeService.getAllEmployees();
		res.status(200).send(employees);
	};

	public getEmployeeById = async (req: Request, res: Response) => {
		const { id } = req.params;
		const employee = await this.employeeService.getEmployeeById(Number(id));
		res.status(200).send(employee);
	};

	public createEmployee = async (req: Request, res: Response) => {
		const { name, email } = req.body;
		const employee = await this.employeeService.createEmployee(name, email);
		res.status(201).send(employee);
	};

	public deleteEmployee = async (req: Request, res: Response) => {
		const { id } = req.params;
		await this.employeeService.deleteEmployee(Number(id));
		res.status(200).send();
	};
}

export default EmployeeController;
