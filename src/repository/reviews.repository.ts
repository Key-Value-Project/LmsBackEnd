import { Repository } from 'typeorm';
import Review from '../entity/reviews.entity';

class ReviewRepository {
    constructor(private reviewRepository: Repository<Review>) {}

    findAll = async (filter: any = {}, relationArray: Array<string> = []): Promise<Review[]> => {
        return await this.reviewRepository.find({ where: filter, relations: relationArray });
    };

    findOne = async (filter: Partial<Review>, relationArray: Array<string> = []): Promise<Review | null> => {
        return await this.reviewRepository.findOne({ where: filter, relations: relationArray });
    };

    save = async (review: Review): Promise<Review> => {
        return await this.reviewRepository.save(review);
    };

    softDelete = async (id: number): Promise<void> => {
        await this.reviewRepository.softDelete({ id });
    };

    update = async (id: number, review: Review): Promise<Review | null> => {
        await this.reviewRepository.update({ id }, review);
        return this.findOne({ id });
    };

    averageRating = async (isbn: number): Promise<number> => {
        const averageRatingResult = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'averageRating')
            .where('review.bookDetail.isbn = :isbn', { isbn })
            .getRawOne();
        return parseFloat(averageRatingResult.averageRating);
    };
}

export default ReviewRepository;
