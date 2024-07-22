import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsBoolean()
    isborrow: boolean;

    @IsNotEmpty()
    @IsString()
    shelf_id: string;
}

export class BorrowBookDto {
    @IsNotEmpty()
    @IsString()
    isbn: number;

    @IsNotEmpty()
    @IsString()
    shelf_id: string;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
