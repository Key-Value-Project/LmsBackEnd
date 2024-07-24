import { Repository } from 'typeorm';
import { GenreDB } from '../entity/genre.entity';

class GenreRepository {
    constructor(private genreRepository: Repository<GenreDB>) {}

    findAll = async (filter: any = {}, relationArray: Array<string> = []): Promise<GenreDB[]> => {
        return await this.genreRepository.find({ where: filter, relations: relationArray });
    };

    findOne = async (filter: Partial<GenreDB>, relationArray: Array<string> = []): Promise<GenreDB | null> => {
        return await this.genreRepository.findOne({ where: filter, relations: relationArray });
    };

    save = async (genre: GenreDB): Promise<GenreDB> => {
        return await this.genreRepository.save(genre);
    };

    softDelete = async (name: string): Promise<void> => {
        await this.genreRepository.softDelete({ name });
    };

    update = async (name: string, genre: GenreDB): Promise<GenreDB | null> => {
        await this.genreRepository.update({ name }, genre);
        return this.findOne({ name });
    };
}

export default GenreRepository;
