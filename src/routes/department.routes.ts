import DepartmentController from "../controller/department.controller";
import DepartmentService from "../service/department.service";
import DepartmentRepository from "../repository/department.repository";
import Department from "../entity/department.entity";
import AppdataSource from "../db/data-source";

const departmentController = new DepartmentController(new DepartmentService(new DepartmentRepository(AppdataSource.getRepository(Department))));
const departmentRouter = departmentController.router;

export default departmentRouter;