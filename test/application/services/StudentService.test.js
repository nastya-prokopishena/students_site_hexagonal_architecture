const StudentService = require('../../../application/services/StudentService');
const StudentRepository = require('../../../infrastructure/repositories/StudentRepository');
const { Op } = require('sequelize');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/StudentRepository');

describe('StudentService', () => {
  let studentService;
  let mockStudentRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockStudentRepository = new StudentRepository();
    studentService = new StudentService(mockStudentRepository);
  });

  describe('createStudent', () => {
    it('should create a student using the repository', async () => {
      const studentData = {
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        email: 'john.doe@example.com',
      };
      const createdStudent = { student_id: 1, ...studentData };
      mockStudentRepository.create.mockResolvedValue(createdStudent);

      const result = await studentService.createStudent(studentData);

      expect(mockStudentRepository.create).toHaveBeenCalledWith(studentData);
      expect(result).toEqual(createdStudent);
    });

    it('should throw an error if repository creation fails', async () => {
      const studentData = {
        first_name: 'John',
        last_name: 'Doe',
      };
      const error = new Error('Database error');
      mockStudentRepository.create.mockRejectedValue(error);

      await expect(studentService.createStudent(studentData)).rejects.toThrow('Database error');
      expect(mockStudentRepository.create).toHaveBeenCalledWith(studentData);
    });
  });

  describe('getAllStudents', () => {
    it('should fetch all students with default options', async () => {
      const students = [
        { student_id: 1, first_name: 'John', last_name: 'Doe' },
        { student_id: 2, first_name: 'Jane', last_name: 'Smith' },
      ];
      mockStudentRepository.findAll.mockResolvedValue(students);

      const result = await studentService.getAllStudents();

      expect(mockStudentRepository.findAll).toHaveBeenCalledWith({ where: {}, include: [] });
      expect(result).toEqual(students);
    });

    it('should fetch students with custom where and include options', async () => {
      const options = {
        where: { last_name: { [Op.iLike]: '%Doe%' } },
        include: [{ model: 'StudentOccupancy', as: 'Occupancies' }],
      };
      const students = [{ student_id: 1, first_name: 'John', last_name: 'Doe' }];
      mockStudentRepository.findAll.mockResolvedValue(students);

      const result = await studentService.getAllStudents(options);

      expect(mockStudentRepository.findAll).toHaveBeenCalledWith(options);
      expect(result).toEqual(students);
    });

    it('should throw an error if repository findAll fails', async () => {
      const error = new Error('Database error');
      mockStudentRepository.findAll.mockRejectedValue(error);

      await expect(studentService.getAllStudents()).rejects.toThrow('Database error');
      expect(mockStudentRepository.findAll).toHaveBeenCalledWith({ where: {}, include: [] });
    });
  });
});