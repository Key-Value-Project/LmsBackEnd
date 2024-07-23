import Subscription from "../entity/subscription.entity";
import BookRepository from "../repository/books.repository";
import SubscriptionRepository from "../repository/subscription.repository";
import BookService from "./book.service";
import BookDetailsService from "./book_details.service";
import BorrowedHistoryService from "./borrowedHistory.service";
import EmployeeService from "./employee.service";

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
    const addSubscription = await this.subscriptionRepository.subscribe(
      subscription
    );
    return addSubscription

    // TODO find status and then revert it
  };

  unsubscribeBook = async (isbn: number, user_id: number) => {
    const subscription = await this.subscriptionRepository.find({bookDetail:{isbn:isbn},user:{id:user_id}})
    const data = await this.subscriptionRepository.softRemove(subscription)
    return data
  }

  toggleNotification = async (isbn: number, user_id: number) => {
    const subscription = await this.subscriptionRepository.toggleNotify(isbn, user_id)
    return subscription
  }

  // getIsbnFromUserId = async (user_id: number) => {
  //   const isbn = await this.subscriptionRepository.getIsbnFromUserId(user_id)
  // }

  // isBookAvailable = async (isbn: number) => {
  //   const books = await this.bookRepository.findAll(isbn)
  // }

  getSubscribedBookStatus = async (user_id: number) => {
   
    const isbn = await this.subscriptionRepository.getIsbnFromUserId(user_id)
    let books = await this.bookRepository.findAll({bookDetail:{isbn},isborrow:false})
    console.log(books)

    return books
  }

  getMessageRequests = async (user_id: number) => {
    let borrowedBook = await this.borrowedHistoryService.findAllBooksBorrowedByUser(Number(user_id))
    const bookId = borrowedBook.book.id
     let borrowedBookDetails = await this.bookService.getBookDetailsById(bookId)
     const isbn = borrowedBookDetails.isbn
     let messageRequests = this.subscriptionRepository.find({bookDetail:{isbn: isbn}, sent_request:true})
    return messageRequests
  }
}
export default SubscriptionService;
