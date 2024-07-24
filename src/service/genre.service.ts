import GenreRepository from '../repository/genre.repository';
import { GenreDB } from '../entity/genre.entity';
import HttpException from '../execptions/http.exceptions';
import { CreateGenreDto } from '../dto/genre.dto';

class GenreService {
    constructor(private genreRepository: GenreRepository) {}

    getAllGenres = async () => {
        return await this.genreRepository.findAll();
    };

    getGenreByName = async (name: string) => {
        return await this.genreRepository.findOne({ name });
    };

    createGenre = async (genreDto: CreateGenreDto) => {
        const newGenre = new GenreDB();
        newGenre.name = genreDto.name;
        return await this.genreRepository.save(newGenre);
    };

    updateGenre = async (name: string, genreDto: CreateGenreDto) => {
        const existingGenre = await this.genreRepository.findOne({ name });
        if (!existingGenre) {
            throw new HttpException(404, 'Not found', ['Genre not found']);
        }
        existingGenre.name = genreDto.name;
        return await this.genreRepository.update(name, existingGenre);
    };

    deleteGenre = async (name: string) => {
        const genre = await this.genreRepository.findOne({ name });
        if (!genre) {
            throw new HttpException(404, 'Not found', ['Genre not found']);
        }
        await this.genreRepository.softDelete(name);
    };
}

export default GenreService;
