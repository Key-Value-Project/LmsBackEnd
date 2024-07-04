import { DataSource, Repository } from "typeorm";
import AppdataSource from "../db/data-source";
import Employee from "../entity/employee.entity";

// DB Calls
class EmployeeRepository {
	// private dataSource: DataSource;
	constructor(private employeeRepositry: Repository<Employee>) {
		// this.dataSource = AppdataSource;
	}

	findAll = async (): Promise<Employee[]> => {
		// const employeeRepositry = this.dataSource.getRepository(Employee);
		return this.employeeRepositry.find();
	};

	findOne = async (filter: Partial<Employee>): Promise<Employee | null> => {
		// const employeeRepositry = this.dataSource.getRepository(Employee);
		return this.employeeRepositry.findOne({ where: filter });
	};

	save = async (employee: Employee): Promise<Employee> => {
		// const employeeRepositry = this.dataSource.getRepository(Employee);
		return this.employeeRepositry.save(employee);
	};

	// saveWithTransaction = async (employee: Employee): Promise<Employee> => {
	// 	const queryRunner = this.dataSource.createQueryRunner();
	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();
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
		// const employeeRepositry = this.dataSource.getRepository(Employee);
		await this.employeeRepositry.softDelete({ id });
	};
}

export default EmployeeRepository;
