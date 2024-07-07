import EmployeeController from "../controller/employee.controller";
import EmployeeRepository from "../repository/employee.repository";
import EmployeeService from "../service/employee.service";
import AppdataSource from "../db/data-source";
import Employee from "../entity/employee.entity";


const employeeController = new EmployeeController(new EmployeeService(new EmployeeRepository(AppdataSource.getRepository(Employee))));
const employeeRouter = employeeController.router;



export default employeeRouter;