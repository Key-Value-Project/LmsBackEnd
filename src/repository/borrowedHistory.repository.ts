import { Repository } from 'typeorm';
import BorrowedHistory from '../entity/borrowedHistory.entity';

class BorrowedHistoryRepository {
    constructor(private borrowedHistoryRepository: Repository<BorrowedHistory>) {}

    find = async (filter: any, relationArray) => this.borrowedHistoryRepository.findOne({ where: filter, relations: relationArray });

    findAll = async (filter: any, relationArray) => this.borrowedHistoryRepository.find({ where: filter, relations: relationArray });

    save = async (data: Partial<BorrowedHistory>) => this.borrowedHistoryRepository.save(data);

    getMostBorrowedBooks = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .select('borrowed_history.book_id', 'book_id')
            .addSelect('COUNT(borrowed_history.book_id)', 'borrowCount')
            .where('borrowed_history.deleted_at IS NULL')
            .groupBy('borrowed_history.book_id')
            .orderBy('COUNT(borrowed_history.book_id)', 'DESC')
            .limit(10)
            .getRawMany();
    };

    getPopularGenres = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .leftJoinAndSelect('borrowedHistory.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .select('bookDetail.genreId', 'genreId')
            .addSelect('COUNT(bookDetail.genreId)', 'genreCount')
            .groupBy('bookDetail.genreId')
            .orderBy('genreCount', 'DESC')
            .getRawMany();
    };

    getUserActivity = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .select('borrowedHistory.userId', 'userId')
            .addSelect('COUNT(borrowedHistory.userId)', 'activityCount')
            .groupBy('borrowedHistory.userId')
            .orderBy('activityCount', 'DESC')
            .getRawMany();
    };

    getBorrowingReport = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .leftJoinAndSelect('borrowedHistory.book', 'book')
            .leftJoinAndSelect('borrowedHistory.user', 'user')
            .select(['borrowedHistory.id', 'borrowedHistory.borrowed_at', 'borrowedHistory.returned_at', 'book.title', 'user.name'])
            .orderBy('borrowedHistory.borrowed_at', 'DESC')
            .getMany();
    };

    getReturnReport = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .leftJoinAndSelect('borrowedHistory.book', 'book')
            .leftJoinAndSelect('borrowedHistory.user', 'user')
            .where('borrowedHistory.returned_at IS NOT NULL')
            .select(['borrowedHistory.id', 'borrowedHistory.borrowed_at', 'borrowedHistory.returned_at', 'book.title', 'user.name'])
            .orderBy('borrowedHistory.returned_at', 'DESC')
            .getMany();
    };

    getOverdueBooksReport = async () => {
        const currentDate = new Date();
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .leftJoinAndSelect('borrowedHistory.book', 'book')
            .leftJoinAndSelect('borrowedHistory.user', 'user')
            .where('borrowedHistory.returned_at IS NULL')
            .andWhere('borrowedHistory.due_date < :currentDate', { currentDate })
            .select(['borrowedHistory.id', 'borrowedHistory.borrowed_at', 'borrowedHistory.due_date', 'book.title', 'user.name'])
            .orderBy('borrowedHistory.due_date', 'ASC')
            .getMany();
    };

    // user analytics
    getBorrowedBooksByUser = async (userId: number) => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .where('borrowedHistory.userId = :userId', { userId })
            .andWhere('borrowedHistory.returnDate IS NULL')
            .getMany();
    };

    getReturnedBooksByUser = async (userId: number) => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .where('borrowedHistory.userId = :userId', { userId })
            .andWhere('borrowedHistory.returnDate IS NOT NULL')
            .getMany();
    };

    getOverdueBooksByUser = async (userId: number) => {
        const currentDate = new Date();
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .where('borrowedHistory.userId = :userId', { userId })
            .andWhere('borrowedHistory.dueDate < :currentDate', { currentDate })
            .andWhere('borrowedHistory.returnDate IS NULL')
            .getMany();
    };
}
export default BorrowedHistoryRepository;
