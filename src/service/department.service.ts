import { CreateDepartmentDto } from "../dto/department.dto";
import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";

// Business logic
class DepartmentService {
	constructor(private departmentRepository: DepartmentRepository) {}

	getAllDepartments = async (): Promise<Department[]> => {
		const allDepartments = await this.departmentRepository.findAll();
		return allDepartments;
	};

	getDepartmentEmployees = async (id: number): Promise<Department | null> => {
		return this.departmentRepository.findOne({ id });
	};

	createDepartment = async (department: CreateDepartmentDto): Promise<Department> => {
		const new_department = new Department();
		new_department.name = department.name;
		new_department.description = department.description;
		return this.departmentRepository.save(new_department);
	};
}

export default DepartmentService;
