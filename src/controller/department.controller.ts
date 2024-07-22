import express, { NextFunction, Request, Response } from 'express';
import DepartmentService from '../service/department.service';
import HttpException from '../execptions/http.exceptions';
import { plainToInstance } from 'class-transformer';
import { CreateDepartmentDto } from '../dto/department.dto';
import { validate } from 'class-validator';
import extractValidationErrors from '../utils/extractValidationErrors';
import authorize from '../middleware/auth.middleware';
import Role from '../utils/role.enum';
import { RequestWithUser } from '../utils/requestWithUser';
import Permission from '../utils/permission.roles';

// API Calls
class DepartmentController {
    public router: express.Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();

        this.router.get('/', authorize, this.getAllDepartments);
        this.router.get('/:name', authorize, this.getDepartmentEmployees);
        this.router.post('/', authorize, this.createDepartment);
        this.router.delete('/:name', authorize, this.deleteDepartment);
        this.router.put('/:name', authorize, this.updateDepartment);
    }

    public getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            if (!departments) {
                throw new HttpException(404, 'Records not found', ['No departments found in the database']);
            }
            res.status(200).send(departments);
        } catch (err) {
            next(err);
        }
    };

    public getDepartmentEmployees = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        try {
            const department = await this.departmentService.getDepartmentEmployees(name);
            if (!department) {
                throw new HttpException(404, 'Record not found', ['NO employees found in the database for the given department name']);
            }
            res.status(200).send(department);
        } catch (err) {
            next(err);
        }
    };

    public getDepartment = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        try {
            const department = await this.departmentService.getDepartment(name);
            if (!department) {
                throw new HttpException(404, 'Record not found', ['Department not found in the database for the given id']);
            }
            res.status(200).send(department);
        } catch (err) {
            next(err);
        }
    };

    public createDepartment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            Permission.userPermission(req, [Role.HR, Role.ADMIN], ['You are not authorized to create a department']);

            const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(departmentDto);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation Error', error_list);
            }
            const saved_department = await this.departmentService.createDepartment(departmentDto);
            if (!saved_department) {
                throw new HttpException(500, 'Internal Server Error', ['Error while creating department']);
            }
            res.status(201).send(saved_department);
        } catch (err) {
            if (err.code === '23505') {
                next(new HttpException(400, 'Bad request', ['Department name already exists']));
            }
            next(err);
        }
    };

    public deleteDepartment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { name } = req.params;
        try {
            Permission.userPermission(req, [Role.HR, Role.ADMIN], ['You are not authorized to delete a department']);

            // delete only if no employees are associated with the department
            const result = await this.departmentService.deleteDepartment(name);
            if (result === 0) {
                throw new HttpException(404, 'Not found', ['Department not found in the database']);
            }
            if (result === null) {
                throw new HttpException(400, 'Bad request', ['Department has employees associated with it']);
            }
            res.status(200).send(`Department with name: ${name} deleted successfully`);
        } catch (err) {
            next(err);
        }
    };

    public updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        try {
            const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(departmentDto);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, 'Validation Error', error_list);
            }

            const updated_department = await this.departmentService.updateDepartment(name, departmentDto);
            if (!updated_department) {
                throw new HttpException(404, 'Not found', ['Department not found in the database']);
            }
            res.status(200).send(updated_department);
        } catch (err) {
            next(err);
        }
    };
}

export default DepartmentController;
