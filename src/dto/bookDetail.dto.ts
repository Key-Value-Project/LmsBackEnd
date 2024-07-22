import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateBookDetailDto {
    @IsNumber()
    @Length(10, 13)
    isbn: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateBookDetailDto {
    @IsNumber()
    @Length(10, 13)
    isbn: number;

    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsString()
    @IsNotEmpty()
    author?: string;

    @IsString()
    @IsNotEmpty()
    description?: string;
}
