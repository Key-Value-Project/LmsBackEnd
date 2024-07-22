import Book from '../entity/book.entity';
import Employee from '../entity/employee.entity';
import Shelf from '../entity/shelves.entity';
import BorrowedHistoryRepository from '../repository/borrowedHistory.repository';

class BorrowedHistoryService {
    constructor(private borrowedHistoryRepository: BorrowedHistoryRepository) {}

    getByBorrowedHistory = async (isbn: number, user_id: number) =>
        this.borrowedHistoryRepository.find({ book: { bookDetail: { isbn } }, user: { id: user_id }, return_date: null }, ['user', 'book']);

    insertBorrowedHistory = async (book: Book, shelf: Shelf, date: Date, expdate: Date, user: Employee) =>
        this.borrowedHistoryRepository.save({
            book,
            borrowedShelf: shelf,
            borrowed_at: date,
            expected_return_date: expdate,
            return_date: null,
            returnShelf: null,
            user,
        });

    updateBorrowedHistory = async (id: number, shelf: Shelf, date: Date) =>
        this.borrowedHistoryRepository.save({
            id,
            return_date: date,
            returnShelf: shelf,
        });
}

export default BorrowedHistoryService;
