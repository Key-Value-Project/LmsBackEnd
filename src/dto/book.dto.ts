import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    @IsBoolean()
    isborrow: boolean;

    @IsNotEmpty()
    @IsString()
    shelf_id: string;

    @IsNotEmpty()
    @IsNumber()
    isbn: number;
}

export class UploadBookDto {
    @IsNotEmpty()
    @IsNumber()
    isbn: number;

    @IsNotEmpty()
    @IsString()
    code: string;
}

export class UpdateBookDto {
    @IsNotEmpty()
    @IsString()
    shelf_id?: string;

    @IsNotEmpty()
    @IsNumber()
    isbn?: number;
}

export class BorrowBookDto {
    @IsNotEmpty()
    @IsNumber()
    isbn: number;

    @IsNotEmpty()
    @IsString()
    shelf_id: string;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
