import { when } from 'jest-when';
import DepartmentRepository from '../../src/repository/department.repository';
import DepartmentService from '../../src/service/department.service';
import Department from '../../src/entity/department.entity';

describe('DepartmentService', () => {
    let departmentRepository: DepartmentRepository;
    let departmentService: DepartmentService;
    const mockDepartment = new Department();
    mockDepartment.id = 1;
    mockDepartment.name = 'HR';
    mockDepartment.description = 'Human Resource';

    const list_department: Department[] = [
        { ...mockDepartment, id: 1, name: 'HR', description: 'Human Resource' },
        { ...mockDepartment, id: 2, name: 'IT', description: 'Information Technology' },
        { ...mockDepartment, id: 3, name: 'SALES', description: 'Sales and Marketing' },
    ];

    beforeAll(() => {
        const dataSource = {
            getRepository: jest.fn(),
        };
        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all departments', async () => {
        const mock = jest.fn(departmentRepository.findAll).mockResolvedValue(list_department);
        departmentRepository.findAll = mock;
        const departments = await departmentService.getAllDepartments();
        expect(departments).toEqual(list_department);
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should return department by name', async () => {
        const mock = jest.fn();
        when(mock).calledWith('HR').mockResolvedValue(mockDepartment);
        when(mock).calledWith('IT').mockResolvedValue(null);
        departmentRepository.findOneDepartment = mock;

        console.log(mockDepartment);

        const department = await departmentService.getDepartment('HR');
        expect(department).toEqual(mockDepartment);

        const department2 = await departmentService.getDepartment('IT');
        expect(department2).toBeNull();
    });

    it('should create a new department', async () => {
        const mock = jest.fn();
        when(mock).calledWith(mockDepartment).mockResolvedValue(mockDepartment);
        departmentRepository.save = mock;

        const new_department = await departmentService.createDepartment(mockDepartment);
        expect(new_department).toEqual(mockDepartment);
    });
});
