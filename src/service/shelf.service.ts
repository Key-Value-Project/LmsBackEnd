import ShelfRepository from '../repository/shelf.repository';
import Shelf from '../entity/shelves.entity';
import HttpException from '../execptions/http.exceptions';
import { CreateShelfDto, UpdateShelfDto } from '../dto/shelf.dto';

class ShelfService {
    constructor(private shelfRepository: ShelfRepository) {}

    getAllShelves = async () => await this.shelfRepository.findAll();

    getShelfById = async (id: string) => await this.shelfRepository.find({ id });

    createShelf = async (shelf: CreateShelfDto) => {
        const newshelf = new Shelf();
        newshelf.code = shelf.code;
        newshelf.location = shelf.location;
        return this.shelfRepository.save(newshelf);
    };

    deleteShelf = async (id: string) => {
        const shelf = await this.shelfRepository.find({ id });
        if (!shelf) {
            throw new HttpException(404, 'Not found', ['Shelf not found in the database']);
        }
        await this.shelfRepository.softDelete(id);
    };

    updateShelf = async (id: string, shelf: UpdateShelfDto) => {
        const newshelf = new Shelf();
        newshelf.code = shelf.code;
        newshelf.location = shelf.location;
        return this.shelfRepository.update(id, newshelf);
    };
}
export default ShelfService;
