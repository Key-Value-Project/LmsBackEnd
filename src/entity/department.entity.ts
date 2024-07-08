import { Column, Entity, OneToMany, Unique } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";


@Entity()
class Department extends AbstractEntity {

    @Column()
    @Unique(["name"])
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Employee, (Employee) => Employee.department)
    employees: Employee[];
}

export default Department;