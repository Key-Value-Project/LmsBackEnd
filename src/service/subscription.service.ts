import Subscription from "../entity/subscription.entity";
import SubscriptionRepository from "../repository/subscription.repository";
import BookDetailsService from "./book_details.service";
import EmployeeService from "./employee.service";

class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private employeeService: EmployeeService,
    private bookDetailService: BookDetailsService
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

    // TODO find status and then revert it
  };

  unsubscribeBook = async (isbn: number, user_id: number) => {
    const subscription = await this.subscriptionRepository.find({bookDetail:{isbn:isbn},user:{id:user_id}})
    const data = await this.subscriptionRepository.softRemove(subscription)
  }
}
export default SubscriptionService;
