import { Repository } from "typeorm";
import Shelf from "../entity/shelves.entity";

class ShelfRepository {
    constructor(private shelfRepository: Repository<Shelf>) {}
    findAll = async () => this.shelfRepository.find();
    find = async (filter: Partial<Shelf>) => this.shelfRepository.findOne({ where: filter });
}
export default ShelfRepository;
