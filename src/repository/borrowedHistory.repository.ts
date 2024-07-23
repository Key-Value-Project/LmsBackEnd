import { Repository } from 'typeorm';
import BorrowedHistory from '../entity/borrowedHistory.entity';

class BorrowedHistoryRepository {
    constructor(private borrowedHistoryRepository: Repository<BorrowedHistory>) {}

    find = async (filter: any, relationArray) => this.borrowedHistoryRepository.findOne({ where: filter, relations: relationArray });

    findAll = async (filter: any, relationArray) => this.borrowedHistoryRepository.find({ where: filter, relations: relationArray });

    save = async (data: Partial<BorrowedHistory>) => this.borrowedHistoryRepository.save(data);
}
export default BorrowedHistoryRepository;
