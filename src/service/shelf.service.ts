import ShelfRepository from "../repository/shelf.repository";

class ShelfService {
    constructor(private shelfRepository: ShelfRepository) {}
    getAllShelves = async () => await this.shelfRepository.findAll();
    getShelfById = async (id: string) => await this.shelfRepository.find({ id });
}
export default ShelfService;
