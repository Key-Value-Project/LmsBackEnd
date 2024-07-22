import BooksController from '../controller/book.controller';
import AppdataSource from '../db/data-source';
import Book from '../entity/book.entity';
import BookDetail from '../entity/bookDetail.entity';
import BorrowedHistory from '../entity/borrowedHistory.entity';
import Department from '../entity/department.entity';
import Employee from '../entity/employee.entity';
import Shelf from '../entity/shelves.entity';
import BookDetailRepository from '../repository/bookDetail.repository';
import BookRepository from '../repository/books.repository';
import BorrowedHistoryRepository from '../repository/borrowedHistory.repository';
import DepartmentRepository from '../repository/department.repository';
import EmployeeRepository from '../repository/employee.repository';
import ShelfRepository from '../repository/shelf.repository';
import BookService from '../service/book.service';
import BookDetailsService from '../service/bookDetails.service';
import BorrowedHistoryService from '../service/borrowedHistory.service';
import DepartmentService from '../service/department.service';
import EmployeeService from '../service/employee.service';
import ShelfService from '../service/shelf.service';

const booksController = new BooksController(
  new BookService(
    new BookRepository(AppdataSource.getRepository(Book)),
    new ShelfService(new ShelfRepository(AppdataSource.getRepository(Shelf))),
    new BookDetailsService(
      new BookDetailRepository(AppdataSource.getRepository(BookDetail))
    ),
    new BorrowedHistoryService(
      new BorrowedHistoryRepository(
        AppdataSource.getRepository(BorrowedHistory)
      )
    ),
    new EmployeeService(
      new EmployeeRepository(AppdataSource.getRepository(Employee)),
      new DepartmentService(
        new DepartmentRepository(AppdataSource.getRepository(Department))
      )
    )
  )
);
const booksRouter = booksController.router;
export default booksRouter;
