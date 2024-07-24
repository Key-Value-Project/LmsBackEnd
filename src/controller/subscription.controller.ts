import express from 'express';
import authorize from '../middleware/auth.middleware';
import { RequestWithUser } from '../utils/requestWithUser';
import SubscriptionService from '../service/subscription.service';
class SubscriptionController {
    public router: express.Router;
    constructor(private subscriptionService: SubscriptionService) {
        this.router = express.Router();
        this.router.put('/', authorize, this.subscribeBook);
        this.router.delete('/', authorize, this.unsubscribeBook);
        this.router.patch('/', authorize, this.toggleNotify);
        this.router.get('/', authorize, this.getSubscribedBookStatus);
        this.router.get('/subscriptions', authorize, this.getSubscriptions);
        this.router.get('/issubscribed', authorize, this.isUserSubscribed);
        this.router.get('/messages', authorize, this.getMessageRequests);
    }

    subscribeBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn, sent_request } = req.body;
        const user_id = req.id;
        const data = await this.subscriptionService.subscribeBook(isbn, Number(user_id), sent_request);
        res.status(200).send(data);
    };

    unsubscribeBook = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn } = req.body;
        const user_id = req.id;
        const data = await this.subscriptionService.unsubscribeBook(isbn, user_id);
        res.status(200).send(data);
    };

    isUserSubscribed = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn } = req.body;
        const user_id = req.id;
        const data = await this.subscriptionService.isUserSubscribed(isbn, user_id);
        if (data === null) {
            res.status(400).send('not subscribed');
        } else {
            res.status(200).send(data);
        }
    };

    toggleNotify = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const { isbn } = req.body;
        const user_id = req.id;
        const data = await this.subscriptionService.toggleNotification(isbn, user_id);
        res.status(200).send(data);
    };

    getSubscriptions = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const data = await this.subscriptionService.getSubscriptions(req.id);
        res.status(200).send(data);
    };

    getSubscribedBookStatus = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const user_id = req.id;
        const data = await this.subscriptionService.getSubscribedBookStatus(user_id);
        let message: string;

        let bookNames = data.map((data) => data.bookDetail.title);
        bookNames = [...new Set(bookNames)];
        if (bookNames.length == 0) {
            res.status(404).send('no active subscriptions');
        } else {
            message = `${bookNames} available now`;

            res.status(200).json({ message: message });
        }
    };

    getMessageRequests = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        let messages = [];
        const user_id = req.id;
        let userName: string;
        let book: string;
        let newMessage: string;
        const allData = await this.subscriptionService.getMessageRequests(user_id);
        if (allData.length == 0) {
            res.status(400).send('no messages');
        } else {
            for (let data of allData) {
                userName = data.user.name;
                book = data.bookDetail.title;

                newMessage = `You have a return request from ${userName} for book ${book}`;
                messages.push(newMessage);
            }
            res.status(200).json({ message: messages });
        }
    };
}
export default SubscriptionController;
