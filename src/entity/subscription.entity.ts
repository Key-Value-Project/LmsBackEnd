import { Column, Entity, ManyToOne } from 'typeorm';
import AbstractEntity from './abstract-entity';
import Employee from './employee.entity';
import BookDetail from './bookDetail.entity';

@Entity()
class Subscription extends AbstractEntity {
    @Column()
    sent_request: boolean;

    @ManyToOne(() => Employee, (employee) => employee.subscriptions)
    user: Employee | Partial<Employee>;

    @ManyToOne(() => BookDetail, (bookDetail) => bookDetail.subscriptions)
    bookDetail: BookDetail | Partial<BookDetail>;
}

export default Subscription;
