import { Repository } from "typeorm";
import Book from "../entity/book.entity";

class BookRepository {
    constructor(private bookRepository: Repository<Book>) {}
    findAll = async (filter: any = {}, relationArray: Array<string> = []) =>
        await this.bookRepository.find({ where: filter, relations: relationArray });
    find = async (filter: any = {}, relationArray: Array<string> = ["bookDetail"]) =>
        await this.bookRepository.findOne({ where: filter, relations: ["bookDetail"] });
    save = async (data: Book) => await this.bookRepository.save(data);
}
export default BookRepository;
