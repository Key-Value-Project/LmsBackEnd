import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import 'reflect-metadata'
import { CreateAddressDto } from "./address.dto";
import { Type } from "class-transformer";
import Role from "../utils/role.enum";

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
