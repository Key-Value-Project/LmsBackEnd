import { DataSource, Repository } from "typeorm";
// import AppdataSource from "../db/data-source";
import Employee from "../entity/employee.entity";

// DB Calls
class EmployeeRepository {
	// private dataSource: DataSource;
	constructor(private employeeRepositry: Repository<Employee>) {
		// this.dataSource = AppdataSource;
	}

	findAll = async (): Promise<Employee[]> => {
		// const employeeRepositry = this.dataSource.getRepository(Employee);
		const list_of_employees = await this.employeeRepositry.find({ relations: ["address", "department"] });
		return list_of_employees;
	};

	findOne = async (filter: Partial<Employee>): Promise<Employee | null> => {
		return this.employeeRepositry.findOne({ where: filter, relations: ["address", "department"] });
	};

	save = async (employee: Employee): Promise<Employee> => {
		return this.employeeRepositry.save(employee);
	};

	// saveWithTransaction = async (employee: Employee): Promise<Employee> => {
	// 	const queryRunner = this.dataSource.createQueryRunner();
	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();line1
	// 	try {
	// 		const employeeRepositry = this.dataSource.getRepository(Employee);
	// 		const response = await queryRunner.manager.save(employee);
	// 		await queryRunner.commitTransaction();
	// 		return response;
	// 	} catch (e) {
	// 		await queryRunner.rollbackTransaction();
	// 		throw e;
	// 	} finally {
	// 		await queryRunner.release();
	// 	}
	// };

	softDelete = async (id: number): Promise<void> => {
		await this.employeeRepositry.softDelete({ id });
	};

	softRemove = async (id: number): Promise<void> => {
		const employee = await this.findOne({ id });
		await this.employeeRepositry.softRemove(employee);
	};

	update = async (id: number, employee: Employee): Promise<Employee> => {
		console.log("EmployeeRepository -> update -> employee", employee);
		await this.employeeRepositry.update({ id }, employee);
		return this.findOne({ id });
	};
}

export default EmployeeRepository;
