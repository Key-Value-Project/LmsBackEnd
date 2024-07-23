import { CreateDepartmentDto } from '../dto/department.dto';
import Department from '../entity/department.entity';
import DepartmentRepository from '../repository/department.repository';

// Business logic
class DepartmentService {
    constructor(private departmentRepository: DepartmentRepository) {}

    getAllDepartments = async (): Promise<Department[]> => {
        const allDepartments = await this.departmentRepository.findAll();
        return allDepartments;
    };

    getDepartment = async (name: string): Promise<Department | null> => {
        const temp = await this.departmentRepository.findOneDepartment({ name });
        console.log(temp);
        return temp;
    };

    createDepartment = async (department: CreateDepartmentDto): Promise<Department> => {
        const new_department = new Department();
        new_department.name = department.name;
        new_department.description = department.description;
        return this.departmentRepository.save(new_department);
    };

    getDepartmentEmployees = async (name: string): Promise<Department | null> => {
        return this.departmentRepository.findOne({ name });
    };

    deleteDepartment = async (name: string): Promise<Department | null | 0> => {
        // delete department if no employees are associated with it
        const department = await this.departmentRepository.findOne({ name });
        if (!department) {
            return 0;
        }
        if (department.employees.length > 0) {
            return null;
        } else {
            return this.departmentRepository.delete(department);
        }
    };

    updateDepartment = async (name: string, department: CreateDepartmentDto): Promise<Department | null> => {
        const departmentData = await this.departmentRepository.findOneDepartment({
            name,
        });
        if (!departmentData) {
            return null;
        }
        departmentData.name = department.name;
        departmentData.description = department.description;
        return this.departmentRepository.save(departmentData);
    };
}

export default DepartmentService;
