import express, { NextFunction, Request, Response } from "express";
import DepartmentService from "../service/department.service";
import HttpException from "../execptions/http.exceptions";
import { plainToInstance } from "class-transformer";
import { CreateDepartmentDto } from "../dto/department.dto";
import { validate } from "class-validator";
import extractValidationErrors from "../utils/extractValidationErrors";

// API Calls
class DepartmentController {
    public router: express.Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();

        this.router.get("/", this.getAllDepartments);
        this.router.get("/:id", this.getDepartmentEmployees);
        this.router.post("/", this.createDepartment);
    }

    public getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            if (!departments) {
                throw new HttpException(404, "Records not found", ["No departments found in the database"]);
            }
            res.status(200).send(departments);
        } catch (err) {
            next(err);
        }
    };

    public getDepartmentEmployees = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const department = await this.departmentService.getDepartmentEmployees(Number(id));
            if (!department) {
                throw new HttpException(404, "Record not found", [
                    "Department not found in the database for the given id",
                ]);
            }
            res.status(200).send(department);
        } catch (err) {
            next(err);
        }
    };

    public createDepartment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(departmentDto);
            if (errors.length > 0) {
                const error_list = extractValidationErrors(errors);
                throw new HttpException(400, "Validation Error", error_list);
            }

            const saved_department = await this.departmentService.createDepartment(departmentDto);
            if (!saved_department) {
                throw new HttpException(500, "Internal Server Error", ["Error while creating department"]);
            }
            res.status(201).send(saved_department);
        } catch (err) {
            next(err);
        }
    };
}

export default DepartmentController;
