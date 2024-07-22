import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsBoolean()
    isborrow: boolean;

    @IsNotEmpty()
    @IsString()
    shelf_id: string;

    @IsNotEmpty()
    @IsString()
    isbn: number;
}

export class UpdateBookDto {
    @IsNotEmpty()
    @IsBoolean()
    isborrow?: boolean;

    @IsNotEmpty()
    @IsString()
    shelf_id?: string;

    @IsNotEmpty()
    @IsString()
    isbn?: number;
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
