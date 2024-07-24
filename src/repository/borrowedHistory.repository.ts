import { Repository } from 'typeorm';
import BorrowedHistory from '../entity/borrowedHistory.entity';

class BorrowedHistoryRepository {
    constructor(private borrowedHistoryRepository: Repository<BorrowedHistory>) {}

    find = async (filter: any, relationArray) => this.borrowedHistoryRepository.findOne({ where: filter, relations: relationArray });

    findAll = async (filter: any, relationArray) => this.borrowedHistoryRepository.find({ where: filter, relations: relationArray });

    save = async (data: Partial<BorrowedHistory>) => this.borrowedHistoryRepository.save(data);

    getMostBorrowedBooks = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .leftJoinAndSelect('borrowedHistory.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .select(['bookDetail.isbn', 'bookDetail.title'])
            .addSelect('COUNT(bookDetail.isbn)', 'borrowCount')
            .where('borrowedHistory.deleted_at IS NULL')
            .groupBy('bookDetail.isbn')
            .orderBy('COUNT(bookDetail.isbn)', 'DESC')
            .limit(10)
            .getRawMany();
    };

    getPopularGenres = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoin('borrowed_history.book', 'book')
            .leftJoin('book.bookDetail', 'bookDetail')
            .select('bookDetail.genre_id', 'genre_id')
            .addSelect('COUNT(bookDetail.genre_id)', 'genre_count')
            .groupBy('bookDetail.genre_id')
            .orderBy('genre_count', 'DESC')
            .getRawMany();
    };

    getUserActivity = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowedHistory')
            .select('borrowedHistory.user_id', 'user_id')
            .addSelect('COUNT(borrowedHistory.user_id)', 'activityCount')
            .groupBy('borrowedHistory.user_id')
            .orderBy('COUNT(borrowedHistory.user_id)', 'DESC')
            .getRawMany();
    };

    getBorrowingReport = async () => {
        const data = await this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.borrowed_at', 'DESC')
            .getMany();
        return data;
    };

    getReturnReport = async () => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .where('borrowed_history.return_date IS NOT NULL')
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.return_date', 'DESC')
            .getMany();
    };

    getOverdueBooksReport = async () => {
        const currentDate = new Date();
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .where('borrowed_history.return_date IS NULL')
            .andWhere('borrowed_history.expected_return_date < :currentDate', { currentDate })
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.expected_return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.expected_return_date', 'ASC')
            .getMany();
    };

    // user analytics
    getBorrowedBooksByUser = async (userId: number) => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .where('borrowed_history.user_id = :userId', { userId })
            .andWhere('borrowed_history.return_date IS NULL')
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.expected_return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.borrowed_at', 'DESC')
            .getMany();
    };

    getReturnedBooksByUser = async (userId: number) => {
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .where('borrowed_history.user_id = :userId', { userId })
            .andWhere('borrowed_history.return_date IS NOT NULL')
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.return_date', 'DESC')
            .getMany();
    };

    getOverdueBooksByUser = async (userId: number) => {
        const currentDate = new Date();
        return this.borrowedHistoryRepository
            .createQueryBuilder('borrowed_history')
            .leftJoinAndSelect('borrowed_history.book', 'book')
            .leftJoinAndSelect('book.bookDetail', 'bookDetail')
            .leftJoinAndSelect('borrowed_history.user', 'user')
            .where('borrowed_history.user_id = :userId', { userId })
            .andWhere('borrowed_history.expected_return_date < :currentDate', { currentDate })
            .andWhere('borrowed_history.return_date IS NULL')
            .select([
                'borrowed_history.id',
                'borrowed_history.borrowed_at',
                'borrowed_history.expected_return_date',
                'book.id',
                'bookDetail.isbn',
                'bookDetail.title',
                'bookDetail.description',
                'user.name',
            ])
            .orderBy('borrowed_history.expected_return_date', 'ASC')
            .getMany();
    };
}
export default BorrowedHistoryRepository;
