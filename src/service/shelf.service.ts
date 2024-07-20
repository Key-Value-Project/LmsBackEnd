import ShelfRepository from "../repository/shelf.repository";

class ShelfService {
    constructor(private shelfRepository: ShelfRepository) {}
    getAllShelves = async () => await this.shelfRepository.findAll();
}
export default ShelfService;
