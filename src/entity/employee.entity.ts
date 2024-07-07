import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Address from "./address.entity";
import Role from "../utils/role.enum";
import { deprecate } from "util";
import Department from "./department.entity";

@Entity()
class Employee extends AbstractEntity {
	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	age: number;

	@OneToOne(() => Address, (address) => address.employee, {
		cascade: true,
		onDelete: "CASCADE",
	})
	address: Address;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	role: Role;

	@ManyToOne(() => Department, department => department.employees)
	department?: Department;
}

export default Employee;
