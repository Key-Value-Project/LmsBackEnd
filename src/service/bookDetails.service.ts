import { ILike } from 'typeorm';
import BookDetailRepository from '../repository/bookDetail.repository';
import BookDetail from '../entity/bookDetail.entity';
import { CreateBookDetailDto } from '../dto/bookDetail.dto';

class BookDetailsService {
    constructor(private bookDetailRepository: BookDetailRepository) {}

    getAllBookDetails = async () => {
        const bookdetails = await this.bookDetailRepository.findAll({}, ['books']);
        const updatedBookDetails = bookdetails.map((bookDetail) => {
            const isAvailable = bookDetail.books.some((book) => !book.isborrow);
            return {
                ...bookDetail,
                status: isAvailable ? 'Available' : 'Not-Available',
                books: undefined,
            };
        });

        const finalBookDetails = updatedBookDetails.map(({ books, ...rest }) => rest);

        console.log(finalBookDetails);
        return finalBookDetails;
    };

    getAllBookDetailsWithBookId = async (isbn: number) => {
        const bookdetails = await this.bookDetailRepository.findAll({ isbn }, ['books', 'books.shelf']);
        const updatedBookDetails = bookdetails.map((bookDetail) => {
            const isAvailable = bookDetail.books.some((book) => !book.isborrow);
            return {
                ...bookDetail,
                status: isAvailable ? 'Available' : 'Not-Available',
            };
        });
        return updatedBookDetails;
    };

    getBookDetailsById = async (isbn: number) => await this.bookDetailRepository.find({ isbn });

    getSearchBookDetailsWithTitle = async (incompleteTitle: string) =>
        await this.bookDetailRepository.findAllbyPpt({ title: ILike(`%${incompleteTitle}%`) });

    createBookDetail = async (book: CreateBookDetailDto) => {
        const newbookDetail = new BookDetail();
        newbookDetail.isbn = book.isbn;
        if (book.author) newbookDetail.author = book.author;
        if (book.title) newbookDetail.title = book.title;
        if (book.description) newbookDetail.description = book.description;
        return this.bookDetailRepository.save(newbookDetail);
    };
}

export default BookDetailsService;
