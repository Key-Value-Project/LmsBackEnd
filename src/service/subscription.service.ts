import Book from '../entity/book.entity';
import Subscription from '../entity/subscription.entity';
import BookRepository from '../repository/books.repository';
import SubscriptionRepository from '../repository/subscription.repository';
import BookService from './book.service';
import BookDetailsService from './bookDetails.service';
import BorrowedHistoryService from './borrowedHistory.service';
import EmployeeService from './employee.service';

class SubscriptionService {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private employeeService: EmployeeService,
        private bookRepository: BookRepository,
        private bookDetailService: BookDetailsService,
        private borrowedHistoryService: BorrowedHistoryService,
        private bookService: BookService
    ) {}

    subscribeBook = async (isbn: number, user_id: number, sent_request: boolean) => {
        const employee = await this.employeeService.getEmployeeById(user_id);
        const bookDetail = await this.bookDetailService.getBookDetailsById(isbn);
        let subscription = new Subscription();

        subscription.bookDetail = bookDetail;
        subscription.user = employee;
        subscription.sent_request = false;
        const addSubscription = await this.subscriptionRepository.subscribe(subscription);
        return addSubscription;
    };

    unsubscribeBook = async (isbn: number, user_id: number) => {
        const subscription = await this.subscriptionRepository.find({
            bookDetail: { isbn: isbn },
            user: { id: user_id },
        });
        const data = await this.subscriptionRepository.softRemove(subscription);
        return data;
    };

    toggleNotification = async (isbn: number, user_id: number) => {
        const subscription = await this.subscriptionRepository.toggleNotify(isbn, user_id);
        return subscription;
    };
    getSubscribedBookStatus = async (user_id: number): Promise<Book[]> => {
        let isbns = await this.subscriptionRepository.getIsbnFromUserId(user_id);
        let books = [];
        console.log(isbns);
        for (let isbn of isbns) {
            let receivedBooks = await this.bookRepository.findAll({ bookDetail: { isbn: isbn }, isborrow: false }, ['bookDetail']);
            books.push(...receivedBooks);
        }

        return books;
    };

    getMessageRequests = async (user_id: number) => {
        let borrowedBooks = await this.borrowedHistoryService.findAllBooksBorrowedByUser(Number(user_id), ['book.bookDetail']);
        let isbns = borrowedBooks.map((borrowedBook) => borrowedBook.book.bookDetail.isbn);
        let messageRequests = [];
        let messageRequest: Subscription[];
        for (let isbn of isbns) {
            messageRequest = await this.subscriptionRepository.findAll({ bookDetail: { isbn: isbn }, sent_request: true });
            console.log(messageRequest);
            if (messageRequest.length) messageRequests.push(...messageRequest);
        }
        return messageRequests;
    };
}
export default SubscriptionService;
