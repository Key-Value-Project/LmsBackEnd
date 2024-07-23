import ShelfRepository from '../repository/shelf.repository';
import Shelf from '../entity/shelves.entity';
import HttpException from '../execptions/http.exceptions';
import { CreateShelfDto, UpdateShelfDto } from '../dto/shelf.dto';

class ShelfService {
    constructor(private shelfRepository: ShelfRepository) {}

    getAllShelves = async () => await this.shelfRepository.findAll();

    getShelfById = async (id: string) => await this.shelfRepository.find({ id });

    getShelfByCode = async (code: string) => await this.shelfRepository.find({ code });

    createShelf = async (shelf: CreateShelfDto) => {
        const newshelf = new Shelf();
        newshelf.code = shelf.code;
        newshelf.location = shelf.location;
        return this.shelfRepository.save(newshelf);
    };

    deleteShelf = async (id: string) => {
        const shelf = await this.shelfRepository.find({ id }, ['books']);
        if (!shelf) {
            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
        }
        if (shelf.books.length > 0) {
            throw new HttpException(400, 'Bad Request', ['Shelf has books']);
        }
        await this.shelfRepository.softDelete(id);
    };

    updateShelf = async (id: string, shelf: UpdateShelfDto) => {
        const currentShelf = await this.shelfRepository.find({ id }, ['books']);
        if (currentShelf.books.length > 0) {
            throw new HttpException(400, 'Bad Request', ['Shelf has books']);
        }
        const newshelf = new Shelf();
        newshelf.code = shelf.code;
        newshelf.location = shelf.location;
        return this.shelfRepository.update(id, newshelf);
    };
}
export default ShelfService;
