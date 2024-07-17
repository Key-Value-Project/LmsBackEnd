import { Column, Entity, Index, ManyToOne, OneToOne, Unique } from "typeorm";
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
	@Index({ unique: true, where: "deleted_at IS NULL" })
	email: string;

	@Column()
	experience: number;

	@Column()
	status: string;

	@OneToOne(() => Address, (address) => address.employee, {
		cascade: true,
		onDelete: "CASCADE",
	})
	address: Address;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	role: Role;

	@ManyToOne(() => Department, (department) => department.employees)
	department?: Department;
}

export default Employee;
