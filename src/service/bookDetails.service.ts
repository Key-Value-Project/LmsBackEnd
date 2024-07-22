import { ILike } from 'typeorm';
import BookDetailRepository from '../repository/bookDetail.repository';

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

    getAllBookDetailsWithBookId = async (isbn) => await this.bookDetailRepository.findAll({ isbn }, ['books', 'books.shelf']);

    getBookDetailsById = async (isbn: number) => await this.bookDetailRepository.find({ isbn });

    getSearchBookDetailsWithTitle = async (incompleteTitle: string) =>
        await this.bookDetailRepository.findAllbyPpt({ title: ILike(`%${incompleteTitle}%`) });
}
export default BookDetailsService;
