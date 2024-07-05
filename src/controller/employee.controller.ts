import EmployeeService from "../service/employee.service";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import HttpException from "../execptions/http.exceptions";
import { plainToInstance } from "class-transformer";
import { CreateEmployeeDto } from "../dto/employee.dto";
import { validate } from "class-validator";
import Role from "../utils/role.enum";
import authorize from "../middleware/auth.middleware";

class EmployeeController {
	public router: express.Router;

	constructor(private employeeService: EmployeeService) {
		this.router = express.Router();

		this.router.get("/", this.getAllEmployees);
		this.router.get("/:id", this.getEmployeeById);
		this.router.post("/", authorize, this.createEmployee);
		this.router.delete("/:id", this.deleteEmployee);
		this.router.post("/login", this.loginEmployee);
	}

	public loginEmployee = async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		try {
			const token = await this.employeeService.login(email, password);
			if (!token) {
				throw new HttpException(401, "Unauthorized", ["Invalid email or password"]);
			}
			res.status(200).json(token);
		} catch (err) {
			next(err);
		}
	};

	public getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const employees = await this.employeeService.getAllEmployees();
			if (!employees) {
				throw new HttpException(404, "Records not found", ["No employees found in the database"]);
			}
			res.status(200).send(employees);
		} catch (err) {
			next(err);
		}
	};

	public getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		try {
			const employee = await this.employeeService.getEmployeeById(Number(id));
			if (!employee) {
				throw new HttpException(404, "Record not found", [
					"Employee not found in the database for the given id",
				]);
			}
			res.status(200).send(employee);
		} catch (err) {
			next(err);
		}
	};

	public createEmployee = async (req: RequestWithUser, res: Response, next: NextFunction) => {
		try {
			const role = req.role;
			if (role !== Role.HR) {
				throw new HttpException(403, "Forbidden", ["You are not authorized to create an employee"]);
			}

			const employeeDto = plainToInstance(CreateEmployeeDto, req.body);
			const errors = await validate(employeeDto);
			if (errors.length) {
				throw new HttpException(400, "Validation failed", errors);
			}

			const savedEmployee = await this.employeeService.createEmployee(employeeDto);
			if (!savedEmployee) {
				throw new HttpException(500, "Employee not created");
			}
			res.status(201).send(savedEmployee);
		} catch (err) {
			next(err);
		}
	};

	public deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		try {
			await this.employeeService.deleteEmployee(Number(id));
			res.status(200).send(`Employee with id: ${id} deleted successfully`);
		} catch (err) {
			if (err) {
				const error = new HttpException(404, "Record not found", [
					"Employee not found in the database for the given id",
				]);
				next(error);
			}
		}
	};
}

export default EmployeeController;
