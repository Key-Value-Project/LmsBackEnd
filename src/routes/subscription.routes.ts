import SubscriptionController from "../controller/subscription.controller";
import AppdataSource from "../db/data-source";
import Book from "../entity/book.entity";
import BookDetail from "../entity/bookDetail.entity";
import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import Subscription from "../entity/subscription.entity";
import BookDetailRepository from "../repository/bookDetail.repository";
import DepartmentRepository from "../repository/department.repository";
import EmployeeRepository from "../repository/employee.repository";
import SubscriptionRepository from "../repository/subscription.repository";
import BookDetailsService from "../service/book_details.service";
import DepartmentService from "../service/department.service";
import EmployeeService from "../service/employee.service";
import SubscriptionService from "../service/subscription.service";

const subscriptionController = new SubscriptionController(
  new SubscriptionService(
    new SubscriptionRepository(AppdataSource.getRepository(Subscription)),
    new EmployeeService(
      new EmployeeRepository(AppdataSource.getRepository(Employee)),
      new DepartmentService(
        new DepartmentRepository(AppdataSource.getRepository(Department))
      )
    ),
    new BookDetailsService(
      new BookDetailRepository(AppdataSource.getRepository(BookDetail))
    )
  )
);
const subscriptionRouter = subscriptionController.router;

export default subscriptionRouter;
