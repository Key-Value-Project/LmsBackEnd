import { IsEnum, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { IsNumberLengthBetween } from '../utils/isbnValidator';
import { Genre } from '../utils/genre.enum';

export class CreateBookDetailDto {
    @IsNumber()
    @IsNumberLengthBetween(10, 13, { message: 'ISBN must be a number with length between 10 and 13 digits' })
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

    @IsEnum(Genre)
    @IsNotEmpty()
    genre: Genre;
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
