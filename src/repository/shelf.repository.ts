import { Repository } from 'typeorm';
import Shelf from '../entity/shelves.entity';

class ShelfRepository {
    constructor(private shelfRepository: Repository<Shelf>) {}

    findAll = async (filter: any = {}, relationArray: Array<string> = []) =>
        await this.shelfRepository.find({ where: filter, relations: relationArray });

    find = async (filter: Partial<Shelf>, relationArray: Array<string> = []) =>
        await this.shelfRepository.findOne({ where: filter, relations: relationArray });

    save = async (shelf: Shelf) => {
        const newshelf = await this.shelfRepository.save(shelf);
        return newshelf;
    };

    softDelete = async (id: string) => {
        await this.shelfRepository.softDelete({ id });
    };

    update = async (id: string, shelf: Shelf) => {
        await this.shelfRepository.update({ id }, shelf);
        return this.find({ id });
    };
}
export default ShelfRepository;
