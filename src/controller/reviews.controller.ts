import express from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ReviewService from '../service/reviews.service';
import authorize from '../middleware/auth.middleware';
import extractValidationErrors from '../utils/extractValidationErrors';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { RequestWithUser } from '../utils/requestWithUser';
import HttpException from '../execptions/http.exceptions';

class ReviewController {
    public router: express.Router;

    constructor(private reviewService: ReviewService) {
        this.router = express.Router();
        this.router.get('/:user', authorize, this.getReviewsByUserId);
        this.router.get('/book/:isbn', authorize, this.getReviewsByBookId);
        this.router.get('/', authorize, this.getAllReviews);
        this.router.post('/', authorize, this.createReview);
        this.router.patch('/:id', authorize, this.updateReview);
        this.router.delete('/:id', authorize, this.deleteReview);
    }

    public getAllReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await this.reviewService.getAllReviews();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getReviewsByUserId = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await this.reviewService.getReviewsByUserId(req.id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getReviewsByBookId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await this.reviewService.getReviewsByBookId(Number(req.params.isbn));
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public createReview = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        try {
            const reviewDto = plainToInstance(CreateReviewDto, req.body);
            const errors = await validate(reviewDto);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const data = await this.reviewService.createReview(reviewDto, req.id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public updateReview = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const reviewDto = plainToInstance(UpdateReviewDto, req.body);
            const errors = await validate(reviewDto);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation failed', error_list);
            }
            const data = await this.reviewService.updateReview(Number(req.params.id), reviewDto);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public deleteReview = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await this.reviewService.deleteReview(Number(req.params.id));
            res.json(data);
        } catch (err) {
            next(err);
        }
    };
}

export default ReviewController;
