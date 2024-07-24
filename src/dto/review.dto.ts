import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IsNumberLengthBetween } from '../utils/isbnValidator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    @IsNumberLengthBetween(10, 13, { message: 'ISBN must be between 10 and 13 digits' })
    isbn: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10)
    rating: number;

    @IsNotEmpty()
    @IsString()
    comment: string;
}

export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    rating?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsNumberLengthBetween(10, 13, { message: 'ISBN must be between 10 and 13 digits' })
    isbn: number;
}
