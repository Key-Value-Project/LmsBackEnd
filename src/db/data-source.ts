import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import Employee from "../entity/employee.entity";
import Address from "../entity/address.entity";

const AppdataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5434,
	database: "training",
	username: "shaheen",
	password: "keyvalue",
	extra: { max: 5, min: 2 }, // connection pool to reduce load
	synchronize: false, // true for development, false for production
	logging: true,
	namingStrategy: new SnakeNamingStrategy(), // EmployeeSalary -> employee_salary
	entities: ["dist/entity/*.js"],
	migrations: ["dist/db/migrations/*.js"],
});

export default AppdataSource;
