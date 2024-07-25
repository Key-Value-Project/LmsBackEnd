import { Repository } from 'typeorm';
import BookDetail from '../entity/bookDetail.entity';

class BookDetailRepository {
    constructor(private bookDetailRepository: Repository<BookDetail>) {}

    findAll = async (filter: Partial<BookDetail> | any = {}, relationArray: Array<string> = []) =>
        this.bookDetailRepository.find({ where: filter, relations: relationArray });

    findAllbyPpt = async (filter: any) => this.bookDetailRepository.findBy(filter);

    find = async (filter: Partial<BookDetail>, relationArray = []) => this.bookDetailRepository.findOne({ where: filter, relations: relationArray });

    save = async (book: BookDetail) => {
        // console.log(book);
        return this.bookDetailRepository.save(book);
    };
}

export default BookDetailRepository;
