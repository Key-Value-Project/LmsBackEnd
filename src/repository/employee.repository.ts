import { DataSource, Repository } from 'typeorm';
// import AppdataSource from "../db/data-source";
import Employee from '../entity/employee.entity';

// DB Calls
class EmployeeRepository {
    // private dataSource: DataSource;
    constructor(private employeeRepositry: Repository<Employee>) {
        // this.dataSource = AppdataSource;
    }

    findAll = async (): Promise<Employee[]> => {
        // const employeeRepositry = this.dataSource.getRepository(Employee);
        const list_of_employees = await this.employeeRepositry.find({ relations: ['address', 'department'] });
        return list_of_employees;
    };

    findOne = async (filter: Partial<Employee>): Promise<Employee | null> => {
        return this.employeeRepositry.findOne({ where: filter, relations: ['address', 'department'] });
    };

    save = async (employee: Employee): Promise<Employee> => {
        return this.employeeRepositry.save(employee);
    };

    softDelete = async (id: number): Promise<void> => {
        await this.employeeRepositry.softDelete({ id });
    };

    softRemove = async (id: number): Promise<void> => {
        const employee = await this.findOne({ id });
        if (employee) {
            // Update the email to a new random value
            employee.email = `deleted_${Date.now()}_${employee.email}`;
            await this.save(employee); // Save the updated employee
            await this.employeeRepositry.softRemove(employee); // Then soft-remove it
        }
    };

    update = async (id: number, employee: Employee): Promise<Employee> => {
        await this.employeeRepositry.update({ id }, employee);
        return this.findOne({ id });
    };

    saveRelationship = async (id: number, employee: Employee): Promise<Employee> => {
        const existing_employee = await this.findOne({ id });
        existing_employee.address.line1 = employee.address.line1;
        existing_employee.address.pincode = employee.address.pincode;
        existing_employee.address.updatedAt = new Date();
        existing_employee.department = employee.department;
        return this.save(existing_employee);
    };
}

export default EmployeeRepository;
