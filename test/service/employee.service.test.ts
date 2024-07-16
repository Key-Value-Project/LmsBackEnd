import EmployeeRepository from "../../src/repository/employee.repository";
import Employee from "../../src/entity/employee.entity";
import EmployeeService from "../../src/service/employee.service";
import Role from "../../src/utils/role.enum";
import { when } from "jest-when";
import Address from "../../src/entity/address.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../../src/dto/employee.dto";
import DepartmentRepository from "../../src/repository/department.repository";
import Department from "../../src/entity/department.entity";
import DepartmentService from "../../src/service/department.service";

describe("EmployeeService", () => {
	let employeeRepository: EmployeeRepository;
	let departmentService: DepartmentService;
	let employeeService: EmployeeService;
	const mockEmployee = new Employee();
	// mockEmployee.id = 8;
	mockEmployee.name = "jonny1";
	mockEmployee.email = "bakka123@gmail.com";
	mockEmployee.experience = 13;
	mockEmployee.status = "Active";
	const new_employee = new Address();
	new_employee.line1 = "line1";
	new_employee.pincode = "454545";
	mockEmployee.address = new_employee;
	mockEmployee.password = "hashed_password";
	mockEmployee.role = Role.DEVELOPER;
	mockEmployee.department = new Department();
	mockEmployee.department.id = 1;
	mockEmployee.department.name = "HR";
	mockEmployee.department.description = "Human akaa Resource";

	const list_employee: Employee[] = [
		{ ...mockEmployee, id: 10, name: "jonny4", role: Role.DEVELOPER },
		{ ...mockEmployee, id: 12, name: "jonny2", role: Role.TESTER },
		{ ...mockEmployee, id: 3, name: "jonny3", role: Role.HR },
	];

	beforeAll(() => {
		const dataSource = {
			getRepository: jest.fn(),
		};
		employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
		departmentService = new DepartmentService(new DepartmentRepository(dataSource.getRepository(Department)));
		employeeService = new EmployeeService(employeeRepository, departmentService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return all employees", async () => {
		const mock = jest.fn(employeeRepository.findAll).mockResolvedValue(list_employee); //empty array for testing purpose
		employeeRepository.findAll = mock;
		const users = await employeeService.getAllEmployees();
		expect(users).toEqual(list_employee);
		expect(mock).toHaveBeenCalledTimes(1);
	});

	it("should return employee by id", async () => {
		const mock = jest.fn();
		when(mock).calledWith({ id: 8 }).mockResolvedValue(mockEmployee);
		when(mock).calledWith({ id: 1 }).mockResolvedValue(null);
		employeeRepository.findOne = mock;

		const user = await employeeService.getEmployeeById(8);
		expect(user).toEqual(mockEmployee);

		const user1 = await employeeService.getEmployeeById(1);
		expect(user1).toEqual(null);
		expect(mock).toHaveBeenCalledTimes(2);
	});

	it("should return a token for valid credentials", async () => {
		jest.spyOn(employeeRepository, "findOne").mockResolvedValue(mockEmployee);
		const mockVerify = jest.fn();
		when(mockVerify).calledWith("password", "hashed_password").mockResolvedValue(true);
		bcrypt.compare = mockVerify;

		const mockSign = jest.fn();
		when(mockSign)
			.calledWith(expect.any(Object), process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
			.mockReturnValue("validToken");
		jwt.sign = mockSign;

		const result = await employeeService.login("test@example.com", "password");
		expect(result).toHaveProperty("token", "validToken");
	});

	it("should throw Unauthorized for invalid email", async () => {
		const mock = jest.fn();
		when(mock).calledWith("invalid@gmail.com").mockResolvedValue(undefined);
		employeeRepository.findOne = mock;

		await expect(employeeService.login("invalid@example.com", "password")).rejects.toThrow("Unauthorized");
	});

	it("should throw Unauthorized for invalid password", async () => {
		jest.spyOn(employeeRepository, "findOne").mockResolvedValue(mockEmployee);
		const mockVerify = jest.fn();
		when(mockVerify).calledWith("password_wrong", "hashed_password").mockResolvedValue(false);
		bcrypt.compare = mockVerify;

		await expect(employeeService.login("valid@example.com", "password_wrong")).rejects.toThrow("Unauthorized");
	});

	it("should call delete method", async () => {
		const mock = jest.fn();
		when(mock).calledWith(8).mockResolvedValue(undefined);
		employeeRepository.softRemove = mock;
		await employeeService.deleteEmployee(8);
		expect(mock).toHaveBeenCalledTimes(1);
	});

	it("should create a new employee and save it", async () => {
		const createEmployeeDto: CreateEmployeeDto = {
			name: "Jonny1",
			email: "bakka123@gmail.com",
			experience: 13,
			status: "Active",
			address: {
				line1: "line1",
				pincode: "454545",
			},
			password: "password123",
			role: Role.DEVELOPER,
			department: {
				name: "HR",
			},
		};

		const department = new Department();
		department.id = 1;
		department.name = "HR";
		department.description = "Human akaa Resource";
		jest.spyOn(departmentService, "getDepartment").mockResolvedValue(department);

		const mockHash = jest.fn();
		when(mockHash).calledWith("password123", 10).mockResolvedValue("hashed_password");
		bcrypt.hash = mockHash;

		const mock = jest.fn();
		when(mock).calledWith(expect.any(Employee)).mockResolvedValue(mockEmployee);
		employeeRepository.save = mock;

		const employee = await employeeService.createEmployee(createEmployeeDto);
		expect(employee).toEqual(mockEmployee);
		expect(employeeRepository.save).toHaveBeenCalledTimes(1);
		expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
	});

	it("should update an employee", async () => {
		const updateEmployeeDto: UpdateEmployeeDto = {
			name: "Jonny1",
			email: "bakka123@gmail.com",
			experience: 13,
			status: "Active",
			password: "password123",
			role: Role.DEVELOPER,
		};
		const mock = jest.fn();
		when(mock).calledWith(8, expect.any(Employee)).mockResolvedValue(mockEmployee);
		employeeRepository.update = mock;

		const mockHash = jest.fn();
		when(mockHash).calledWith("password123", 10).mockResolvedValue("hashed_password");
		bcrypt.hash = mockHash;

		const employee = await employeeService.updateEmployee(8, updateEmployeeDto);
		expect(employee).toEqual(mockEmployee);
		expect(employeeRepository.update).toHaveBeenCalledTimes(1);
		expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
	});

	it("should update an employee relationship", async () => {
		const updateEmployeeRelationshipDto = {
			address: {
				line1: "line1",
				pincode: "454545",
			},
			department: {
				name: "HR",
			},
		};
		const department = new Department();
		department.id = 1;
		department.name = "HR";
		department.description = "Human akaa Resource";
		jest.spyOn(departmentService, "getDepartment").mockResolvedValue(department);

		const mock = jest.fn();
		when(mock).calledWith(8, expect.any(Employee)).mockResolvedValue(mockEmployee);
		employeeRepository.saveRelationship = mock;

		const employee = await employeeService.updateEmployeeRelationship(8, updateEmployeeRelationshipDto);
		expect(employee).toEqual(mockEmployee);
		expect(employeeRepository.saveRelationship).toHaveBeenCalledTimes(1);
	});
});
