import { ILike, Like } from "typeorm";
import BookDetail from "../entity/bookDetail.entity";
import BookDetailRepository from "../repository/bookDetail.repository";

class BookDetailsService {
    constructor(private bookDetailRepository: BookDetailRepository) {}
    getAllBookDetails = async () => await this.bookDetailRepository.findAll();
    getAllBookDetailsWithBookId = async (isbn) =>
        await this.bookDetailRepository.findAll({ isbn }, ["books", "books.shelf"]);
    getBookDetailsById = async (isbn: number) => await this.bookDetailRepository.find({ isbn });
    getSearchBookDetailsWithTitle = async (incompleteTitle: string) =>
        await this.bookDetailRepository.findAllbyPpt({ title: ILike(`${incompleteTitle}%`) });

    
    createBookDetail=async(book:BookDetail)=>{
        const newbookDetail = new BookDetail();
		newbookDetail.isbn = book.isbn;
        newbookDetail.author=book.author;
        newbookDetail.title=book.title;
		newbookDetail.description = book.description;
		return this.bookDetailRepository.save(newbookDetail);
    };

}

export default BookDetailsService;
