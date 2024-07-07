import { Repository } from "typeorm";
import Department from "../entity/department.entity";

//DB Calls
class DepartmentRepository {
	constructor(private departmentRepository: Repository<Department>) {}

	findAll = async (): Promise<Department[]> => {
		const list_of_departments = await this.departmentRepository.find();
		return list_of_departments;
	};

	findOne = async (filter: Partial<Department>): Promise<Department | null> => {
		return this.departmentRepository.findOne({ where: filter, relations: ["employees"] });
	};

	save = async (department: Department): Promise<Department> => {
		return this.departmentRepository.save(department);
	};
}

export default DepartmentRepository;