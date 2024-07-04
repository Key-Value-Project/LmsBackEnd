import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";

// Bussiness Logic
class EmployeeService {
	private employeeRepository: EmployeeRepository;
	constructor() {
		this.employeeRepository = new EmployeeRepository();
	}

	getAllEmployees = async (): Promise<Employee[]> => {
		return this.employeeRepository.findAll();
	};

	getEmployeeById = async (id: number): Promise<Employee | null> => {
		return this.employeeRepository.findOne({ id });
	};

	createEmployee = async (name: string, email: string): Promise<Employee> => {
		const new_employee = new Employee();
		new_employee.name = name;
		new_employee.email = email;
		return this.employeeRepository.save(new_employee);
	};

	deleteEmployee = async (id: number): Promise<void> => {
		await this.employeeRepository.softDelete(id);
	};
}

export default EmployeeService;
