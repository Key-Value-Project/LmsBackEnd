import ReviewController from '../controller/reviews.controller';
import AppdataSource from '../db/data-source';
import BookDetail from '../entity/bookDetail.entity';
import Department from '../entity/department.entity';
import Employee from '../entity/employee.entity';
import { GenreDB } from '../entity/genre.entity';
import Review from '../entity/reviews.entity';
import BookDetailRepository from '../repository/bookDetail.repository';
import DepartmentRepository from '../repository/department.repository';
import EmployeeRepository from '../repository/employee.repository';
import GenreRepository from '../repository/genre.repository';
import ReviewRepository from '../repository/reviews.repository';
import BookDetailsService from '../service/bookDetails.service';
import DepartmentService from '../service/department.service';
import EmployeeService from '../service/employee.service';
import GenreService from '../service/genre.service';
import ReviewService from '../service/reviews.service';

const reviewsController = new ReviewController(
    new ReviewService(
        new ReviewRepository(AppdataSource.getRepository(Review)),
        new BookDetailsService(
            new BookDetailRepository(AppdataSource.getRepository(BookDetail)),
            new GenreService(new GenreRepository(AppdataSource.getRepository(GenreDB)))
        ),
        new EmployeeService(
            new EmployeeRepository(AppdataSource.getRepository(Employee)),
            new DepartmentService(new DepartmentRepository(AppdataSource.getRepository(Department)))
        )
    )
);

const reviewsRouter = reviewsController.router;
export default reviewsRouter;
