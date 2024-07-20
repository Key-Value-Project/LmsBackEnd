import { Repository } from "typeorm";
import Book from "../entity/book.entity";

class BookRepository {
    constructor(private bookRepository: Repository<Book>) {}
    findAll = async (filter: Partial<Book> = {}, relationArray: Array<string> = []) =>
        await this.bookRepository.find({ where: filter, relations: relationArray });
}
export default BookRepository;
