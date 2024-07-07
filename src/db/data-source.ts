import Employee from "../entity/employee.entity";
import Address from "../entity/address.entity";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import "dotenv/config";

const AppdataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	extra: { max: 5, min: 2 }, // connection pool to reduce load
	synchronize: false, // true for development, false for production
	logging: true,
	namingStrategy: new SnakeNamingStrategy(), // EmployeeSalary -> employee_salary
	entities: ["dist/src/entity/*.js"],
	migrations: ["dist/src/db/migrations/*.js"],
});

export default AppdataSource;
