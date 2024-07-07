import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import 'reflect-metadata'
import { CreateAddressDto } from "./address.dto";
import { Type } from "class-transformer";
import Role from "../utils/role.enum";
import { CreateDepartmentDto } from "./department.dto";

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> CreateAddressDto)
    address: CreateAddressDto

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateDepartmentDto)
    department?: CreateDepartmentDto
    
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;


}

export class UpdateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> CreateAddressDto)
    address: CreateAddressDto

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateDepartmentDto)
    department: CreateDepartmentDto

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}

export class updatedEmployeePasswordDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}
