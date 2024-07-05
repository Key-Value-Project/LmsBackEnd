import { CreateEmployeeDto } from "../dto/employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import HttpException from "../execptions/http.exceptions";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/jwtPayload";
import "dotenv/config";

// Bussiness Logic
class EmployeeService {
	constructor(private employeeRepository: EmployeeRepository) {}

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
		// console.log(token);

		return { token };
	};

	getAllEmployees = async (): Promise<Employee[]> => {
		return this.employeeRepository.findAll();
	};

	getEmployeeById = async (id: number): Promise<Employee | null> => {
		return this.employeeRepository.findOne({ id });
	};

	createEmployee = async (employee: CreateEmployeeDto): Promise<Employee> => {
		const new_employee = new Employee();
		new_employee.name = employee.name;
		new_employee.email = employee.email;
		new_employee.age = employee.age;

		const new_address = new Address();
		new_address.line1 = employee.address.line1;
		new_address.pincode = employee.address.pincode;
		new_employee.address = new_address;

		new_employee.password = employee.password ? await bcrypt.hash(employee.password, 10) : null;
		new_employee.role = employee.role;
		return this.employeeRepository.save(new_employee);
	};

	deleteEmployee = async (id: number): Promise<void> => {
		await this.employeeRepository.softRemove(id);
	};
}

export default EmployeeService;
