import { Column, Entity, ManyToOne } from 'typeorm';
import AbstractEntity from './abstract-entity';
import BookDetail from './bookDetail.entity';
import Employee from './employee.entity';
import { IsNumber, IsString, Max, Min } from 'class-validator';

@Entity()
class Review extends AbstractEntity {
    @ManyToOne(() => BookDetail, (bookDetail) => bookDetail.reviews)
    bookDetail: BookDetail;

    @ManyToOne(() => Employee, (employee) => employee.reviews)
    employee: Employee;

    @Column()
    @IsNumber()
    @Min(1)
    @Max(10)
    rating: number;

    @Column('text')
    @IsString()
    comment: string;
}

export default Review;
