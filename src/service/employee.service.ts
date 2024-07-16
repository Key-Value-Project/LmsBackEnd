import { CreateEmployeeDto, UpdateEmployeeDto, updateEmployeeRelationshipDto } from "../dto/employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import HttpException from "../execptions/http.exceptions";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/jwtPayload";
import "dotenv/config";
import Department from "../entity/department.entity";
import DepartmentService from "./department.service";

// Bussiness Logic
class EmployeeService {
	constructor(private employeeRepository: EmployeeRepository, private departmentService: DepartmentService) {}

	login = async (email: string, password: string) => {
		const employee = await this.employeeRepository.findOne({ email });
		if (!employee) {
			throw new HttpException(401, "Unauthorized", ["Invalid email or password"]);
		}
		const isValidPassword = await bcrypt.compare(password, employee.password);
		if (!isValidPassword) {
			throw new HttpException(401, "Unauthorized", ["Invalid email or password"]);
		}

		const payload: JwtPayload = {
			name: employee.name,
			email: employee.email,
			role: employee.role,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
		return { token };
	};

	getAllEmployees = async (): Promise<Employee[]> => {
		const allEmployess = await this.employeeRepository.findAll();
		return allEmployess;
	};

	getEmployeeById = async (id: number): Promise<Employee | null> => {
		return this.employeeRepository.findOne({ id });
	};

	createEmployee = async (employee: CreateEmployeeDto): Promise<Employee> => {
		const departmentData: Department = await this.departmentService.getDepartment(employee.department.name);
		if (!departmentData) {
			throw new HttpException(404, "Not found", ["Department not found in the database"]);
		}
		const new_employee = new Employee();
		new_employee.name = employee.name;
		new_employee.email = employee.email;
		new_employee.experience = employee.experience;
		new_employee.status = employee.status;

		const new_address = new Address();
		new_address.line1 = employee.address.line1;
		new_address.pincode = employee.address.pincode;
		new_employee.address = new_address;
		new_employee.department = departmentData;

		new_employee.password = employee.password ? await bcrypt.hash(employee.password, 10) : null;
		new_employee.role = employee.role;

		return this.employeeRepository.save(new_employee);
	};

	deleteEmployee = async (id: number): Promise<void> => {
		await this.employeeRepository.softRemove(id);
	};

	updateEmployee = async (id: number, employee: UpdateEmployeeDto): Promise<Employee | null> => {
		const new_employee = new Employee();
		new_employee.name = employee.name;
		new_employee.email = employee.email;
		new_employee.experience = employee.experience;
		new_employee.status = employee.status;
		// update function cant insert cascaded values like address and department
		new_employee.role = employee.role;
		new_employee.password = employee.password ? await bcrypt.hash(employee.password, 10) : null;

		return this.employeeRepository.update(id, new_employee);
	};

	updateEmployeeRelationship = async (
		id: number,
		employee: updateEmployeeRelationshipDto
	): Promise<Employee | null> => {
		const new_employee = new Employee();
		const new_address = new Address();
		new_address.line1 = employee.address.line1;
		new_address.pincode = employee.address.pincode;
		new_employee.address = new_address;

		const new_department = await this.departmentService.getDepartment(employee.department.name);
		if (!new_department) {
			throw new HttpException(404, "Not found", ["Department not found in the database"]);
		}
		new_employee.department = new_department;
		// remove password from the response
		return this.employeeRepository.saveRelationship(id, new_employee);
	};
}

export default EmployeeService;
