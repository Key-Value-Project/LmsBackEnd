import ReviewRepository from '../repository/reviews.repository';
import Review from '../entity/reviews.entity';
import HttpException from '../execptions/http.exceptions';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import EmployeeRepository from '../repository/employee.repository';
import BookDetailRepository from '../repository/bookDetail.repository';
import EmployeeService from './employee.service';
import BookDetailsService from './bookDetails.service';

class ReviewService {
    constructor(
        private reviewRepository: ReviewRepository,
        private bookDetailService: BookDetailsService,
        private employeeService: EmployeeService
    ) {}

    getAllReviews = async () => {
        return await this.reviewRepository.findAll();
    };

    getReviewsByUserId = async (userId: number) => {
        const reviews = await this.reviewRepository.findAll({ employee: { id: userId } });
        if (!reviews || reviews.length === 0) {
            throw new HttpException(404, 'Not found', ['Review not found']);
        }
        return reviews;
    };

    getReviewsByBookId = async (isbn: number) => {
        const reviews = await this.reviewRepository.findAll({ bookDetail: { isbn: isbn } });
        if (!reviews || reviews.length === 0) {
            throw new HttpException(404, 'Not found', ['Review not found']);
        }

        const averageRating = await this.reviewRepository.averageRating(isbn);

        return {
            reviews,
            averageRating,
        };
    };

    createReview = async (reviewDto: CreateReviewDto, userId: number) => {
        const newReview = new Review();
        newReview.rating = reviewDto.rating;
        newReview.comment = reviewDto.comment;
        newReview.bookDetail = await this.bookDetailService.getBookDetailsById(reviewDto.isbn);
        if (!newReview.bookDetail) {
            throw new HttpException(404, 'Not found', ['Book not found']);
        }
        newReview.employee = await this.employeeService.getEmployeeById(userId);
        if (!newReview.employee) {
            throw new HttpException(404, 'Not found', ['Employee not found']);
        }
        return await this.reviewRepository.save(newReview);
    };

    updateReview = async (id: number, reviewDto: UpdateReviewDto) => {
        const existingReview = await this.reviewRepository.findOne({ id });
        if (!existingReview) {
            throw new HttpException(404, 'Not found', ['Review not found']);
        }
        existingReview.rating = reviewDto.rating;
        existingReview.comment = reviewDto.comment;
        return await this.reviewRepository.update(id, existingReview);
    };

    deleteReview = async (id: number) => {
        const review = await this.reviewRepository.findOne({ id });
        if (!review) {
            throw new HttpException(404, 'Not found', ['Review not found']);
        }
        await this.reviewRepository.softDelete(id);
    };
}

export default ReviewService;
