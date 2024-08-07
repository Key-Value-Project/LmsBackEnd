import express from 'express';
import AnalyticsService from '../service/analytics.service';
import { Request, Response, NextFunction } from 'express';
import authorize from '../middleware/auth.middleware';

class AnalyticsController {
    public router: express.Router;

    constructor(private analyticsService: AnalyticsService) {
        this.router = express.Router();
        this.router.get('/most-borrowed-books', authorize, this.getMostBorrowedBooks);
        this.router.get('/popular-genres', authorize, this.getPopularGenres);
        this.router.get('/user-activity', authorize, this.getUserActivity);
        this.router.get('/borrowing-report', authorize, this.getBorrowingReport);
        this.router.get('/return-report', authorize, this.getReturnReport);
        this.router.get('/overdue-books-report', authorize, this.getOverdueBooksReport);
        this.router.get('/borrowed-books/:userId', authorize, this.getBorrowedBooksByUser);
        this.router.get('/returned-books/:userId', authorize, this.getReturnedBooksByUser);
        this.router.get('/overdue-books/:userId', authorize, this.getOverdueBooksByUser);
    }

    public getMostBorrowedBooks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getMostBorrowedBooks();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getPopularGenres = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getPopularGenres();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getUserActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getUserActivity();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getBorrowingReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getBorrowingReport();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getReturnReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getReturnReport();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getOverdueBooksReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.analyticsService.getOverdueBooksReport();
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getBorrowedBooksByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const data = await this.analyticsService.getBorrowedBooksByUser(userId);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getReturnedBooksByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const data = await this.analyticsService.getReturnedBooksByUser(userId);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };

    public getOverdueBooksByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const data = await this.analyticsService.getOverdueBooksByUser(userId);
            res.json(data);
        } catch (err) {
            next(err);
        }
    };
}

export default AnalyticsController;
