import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateBookDto {
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
export class UploadBookDtoExcel extends UploadBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    description: string;
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
