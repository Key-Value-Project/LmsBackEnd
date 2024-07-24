import BookDetailRepository from '../repository/bookDetail.repository';
import BorrowedHistoryRepository from '../repository/borrowedHistory.repository';
import EmployeeRepository from '../repository/employee.repository';

class AnalyticsService {
    constructor(private borrowedHistoryRepository: BorrowedHistoryRepository) {}

    getMostBorrowedBooks = async () => this.borrowedHistoryRepository.getMostBorrowedBooks();

    getPopularGenres = async () => this.borrowedHistoryRepository.getPopularGenres();

    getUserActivity = async () => this.borrowedHistoryRepository.getUserActivity();

    getBorrowingReport = async () => this.borrowedHistoryRepository.getBorrowingReport();

    getReturnReport = async () => this.borrowedHistoryRepository.getReturnReport();

    getOverdueBooksReport = async () => this.borrowedHistoryRepository.getOverdueBooksReport();

    // user analytics
    getBorrowedBooksByUser = async (userId: number) => this.borrowedHistoryRepository.getBorrowedBooksByUser(userId);

    getReturnedBooksByUser = async (userId: number) => this.borrowedHistoryRepository.getReturnedBooksByUser(userId);

    getOverdueBooksByUser = async (userId: number) => this.borrowedHistoryRepository.getOverdueBooksByUser(userId);
}

export default AnalyticsService;
