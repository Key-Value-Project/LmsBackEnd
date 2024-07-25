import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShelfDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    location: string;
}

export class UpdateShelfDto {
    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    location?: string;
}
