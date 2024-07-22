import { Repository } from 'typeorm';
import Book from '../entity/book.entity';

class BookRepository {
    constructor(private bookRepository: Repository<Book>) {}

    findAll = async (filter: any = {}, relationArray: Array<string> = []) =>
        await this.bookRepository.find({ where: filter, relations: relationArray });

    find = async (filter: any = {}, relationArray: Array<string> = []) =>
        await this.bookRepository.findOne({ where: filter, relations: relationArray });

    save = async (data: Book) => await this.bookRepository.save(data);

    softDelete=async(id:string)=> await this.bookRepository.softDelete({id})
    

    update=async(id:string,book:Book)=>{
    await this.bookRepository.update({id},book);
    return this.find({id})
    };

}
export default BookRepository;
