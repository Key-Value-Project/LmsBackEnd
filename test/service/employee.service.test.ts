import { getRepository } from "typeorm";
import EmployeeRepository from "../../src/repository/employee.repository";
import Employee from "../../src/entity/employee.entity";
import EmployeeService from "../../src/service/employee.service";
import Role from "../../src/utils/role.enum";
import { when } from "jest-when";

describe("EmployeeService", () => {
	let employeeRepository: EmployeeRepository;
	let employeeService: EmployeeService;
	const mockEmployee = new Employee();
	mockEmployee.id = 8;
	mockEmployee.name = "jonny";
	mockEmployee.email = "bakka123@gmail.com";
	mockEmployee.age = 13;
	mockEmployee.password = "$2b$10$OcPOZabm2huQKiLifdmh9erZDWsIneyS4eEnm1JfbLquahHepgh9.";
	mockEmployee.role = Role.HR;

	beforeAll(() => {
		const dataSource = {
			getRepository: jest.fn(),
		};
		employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
		employeeService = new EmployeeService(employeeRepository);
	});

	it("should return all employees", async () => {
		const mock = jest.fn(employeeRepository.findAll).mockResolvedValue([]); //empty array for testing purpose
		employeeRepository.findAll = mock;

		const users = await employeeService.getAllEmployees();
		expect(users).toEqual([]);
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
});
