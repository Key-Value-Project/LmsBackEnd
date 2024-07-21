import BorrowedHistoryRepository from "../repository/borrowedHistory.repository";

class BorrowedHistoryService {
    constructor(private borrowedHistoryRepository: BorrowedHistoryRepository) {}
    getByBorrowedHistory = async (isbn, user_id) =>
        this.borrowedHistoryRepository.find(
            { book: { bookDetail: { isbn } }, user: { id: user_id }, return_date: null },
            ["user", "book"]
        );
    insertBorrowedHistory = async (book, shelf, date, expdate, user) =>
        this.borrowedHistoryRepository.save({
            book,
            borrowedShelf: shelf,
            borrowed_at: date,
            expected_return_date: expdate,
            return_date: null,
            returnShelf: null,
            user,
        });
    updateBorrowedHistory = async (id, shelf, date) =>
        this.borrowedHistoryRepository.save({
            id,
            return_date: date,
            returnShelf: shelf,
        });
}

export default BorrowedHistoryService;
