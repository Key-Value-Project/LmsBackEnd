import { IsNotEmpty, IsString } from "class-validator";
import "reflect-metadata";

export class CreateDepartmentDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	description: string;
}
