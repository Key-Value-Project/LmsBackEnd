import { ILike } from 'typeorm';
import BookDetailRepository from '../repository/bookDetail.repository';

class BookDetailsService {
    constructor(private bookDetailRepository: BookDetailRepository) {}

    getAllBookDetails = async () => await this.bookDetailRepository.findAll();

    getAllBookDetailsWithBookId = async (isbn) => await this.bookDetailRepository.findAll({ isbn }, ['books', 'books.shelf']);

    getBookDetailsById = async (isbn: number) => await this.bookDetailRepository.find({ isbn });

    getSearchBookDetailsWithTitle = async (incompleteTitle: string) =>
        await this.bookDetailRepository.findAllbyPpt({ title: ILike(`%${incompleteTitle}%`) });
}
export default BookDetailsService;
