import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";

@Entity()
class Address extends AbstractEntity {
	@Column()
	line1: string;

	@Column()
	pincode: string;

	@OneToOne(() => Employee, (employee) => employee.address)
	@JoinColumn()
	employee: Employee;
}

export default Address;
