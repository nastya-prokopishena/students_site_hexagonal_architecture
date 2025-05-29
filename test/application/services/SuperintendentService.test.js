const SuperintendentService = require('../../../application/services/SuperintendentService');
const ApplicationService = require('../../../application/services/ApplicationService');
const StudentService = require('../../../application/services/StudentService');
const DormitoryService = require('../../../application/services/DormitoryService');
const AssignRoom = require('../../../application/use-cases/AssignRoom');
const SuperintendentRepository = require('../../../infrastructure/repositories/SuperintendentRepository');
const bcrypt = require('bcrypt');
const { Student, StudentOccupancy, Room, Dormitory } = require('../../../infrastructure/database/models');
const { Op } = require('sequelize');

// Mock dependencies
jest.mock('../../../application/services/ApplicationService');
jest.mock('../../../application/services/StudentService');
jest.mock('../../../application/services/DormitoryService');
jest.mock('../../../application/use-cases/AssignRoom');
jest.mock('../../../infrastructure/repositories/SuperintendentRepository');
jest.mock('../../../infrastructure/database/models');
jest.mock('bcrypt');

describe('SuperintendentService', () => {
  let superintendentService;
  let mockApplicationService;
  let mockStudentService;
  let mockDormitoryService;
  let mockAssignRoom;
  let mockSuperintendentRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock instances
    mockApplicationService = new ApplicationService();
    mockStudentService = new StudentService();
    mockDormitoryService = new DormitoryService();
    mockAssignRoom = new AssignRoom();
    mockSuperintendentRepository = new SuperintendentRepository();

    // Instantiate service with mocked dependencies
    superintendentService = new SuperintendentService();
    superintendentService.applicationService = mockApplicationService;
    superintendentService.studentService = mockStudentService;
    superintendentService.dormitoryService = mockDormitoryService;
    superintendentService.assignRoom = mockAssignRoom;
    superintendentService.superintendentRepository = mockSuperintendentRepository;
  });

  describe('getAllApplications', () => {
    it('should return all applications from ApplicationService', async () => {
      const mockApplications = [{ application_id: 1 }, { application_id: 2 }];
      mockApplicationService.getAllApplications.mockResolvedValue(mockApplications);

      const result = await superintendentService.getAllApplications();

      expect(mockApplicationService.getAllApplications).toHaveBeenCalled();
      expect(result).toEqual(mockApplications);
    });
  });

  describe('fetchStudentsWithOccupancies', () => {
    it('should fetch students with occupancies, rooms, and dormitories', async () => {
      const mockStudents = [
        {
          student_id: 1,
          first_name: 'John',
          middle_name: 'M',
          last_name: 'Doe',
          date_of_birth: '2000-01-01',
          Occupancies: [
            {
              occupancy_id: 1,
              student_id: 1,
              dormitory_id: 1,
              room_id: 1,
              lease_start_date: '2023-09-01',
              lease_term: 12,
              lease_end_date: '2024-08-31',
              benefit_id: 1,
              Room: {
                room_id: 1,
                room_number: 101,
                Dormitory: {
                  dormitory_id: 1,
                  name: 'Dorm A',
                },
              },
            },
          ],
        },
      ];
      Student.findAll.mockResolvedValue(mockStudents);

      const result = await superintendentService.fetchStudentsWithOccupancies();

      expect(Student.findAll).toHaveBeenCalledWith({
        attributes: ['student_id', 'first_name', 'middle_name', 'last_name', 'date_of_birth'],
        include: [
          {
            model: StudentOccupancy,
            as: 'Occupancies',
            attributes: ['occupancy_id', 'student_id', 'dormitory_id', 'room_id', 'lease_start_date', 'lease_term', 'lease_end_date', 'benefit_id'],
            include: [
              {
                model: Room,
                as: 'Room',
                attributes: ['room_id', 'room_number'],
                include: [
                  {
                    model: Dormitory,
                    as: 'Dormitory',
                    attributes: ['dormitory_id', 'name'],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(result).toEqual(mockStudents);
    });
  });

  describe('formatResidentData', () => {
    it('should format student data with occupancy, room, and dormitory', () => {
      const student = {
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        Occupancies: [
          {
            Room: {
              room_number: 101,
              Dormitory: {
                name: 'Dorm A',
              },
            },
          },
        ],
      };

      const result = superintendentService.formatResidentData(student);

      expect(result).toEqual({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        dormitory_name: 'Dorm A',
        room_number: 101,
      });
    });

    it('should handle missing occupancy data', () => {
      const student = {
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        Occupancies: [],
      };

      const result = superintendentService.formatResidentData(student);

      expect(result).toEqual({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        dormitory_name: 'Не визначено',
        room_number: 'Не визначено',
      });
    });
  });

  describe('getResidentsWithAccommodation', () => {
    it('should return formatted residents with accommodation', async () => {
      const mockStudents = [
        {
          first_name: 'John',
          middle_name: 'M',
          last_name: 'Doe',
          date_of_birth: '2000-01-01',
          Occupancies: [
            {
              Room: {
                room_number: 101,
                Dormitory: {
                  name: 'Dorm A',
                },
              },
            },
          ],
        },
      ];
      jest.spyOn(superintendentService, 'fetchStudentsWithOccupancies').mockResolvedValue(mockStudents);
      jest.spyOn(superintendentService, 'formatResidentData').mockReturnValue({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        dormitory_name: 'Dorm A',
        room_number: 101,
      });

      const result = await superintendentService.getResidentsWithAccommodation();

      expect(superintendentService.fetchStudentsWithOccupancies).toHaveBeenCalled();
      expect(superintendentService.formatResidentData).toHaveBeenCalledWith(mockStudents[0]);
      expect(result).toEqual([
        {
          first_name: 'John',
          middle_name: 'M',
          last_name: 'Doe',
          date_of_birth: '2000-01-01',
          dormitory_name: 'Dorm A',
          room_number: 101,
        },
      ]);
    });
  });

  describe('createStudentData', () => {
    it('should create student data from application', () => {
      const application = {
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        home_address: '123 Main St',
        phone_number: '1234567890',
        email: 'john.doe@example.com',
        home_city: 'Kyiv',
        home_region: 'Kyiv Region',
        home_campus_number: '1',
        home_street_number: '123',
      };

      const result = superintendentService.createStudentData(application);

      expect(result).toEqual({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        home_address: '123 Main St',
        phone_number: '1234567890',
        email: 'john.doe@example.com',
        home_city: 'Kyiv',
        home_region: 'Kyiv Region',
        home_campus_number: '1',
        home_street_number: '123',
      });
    });
  });

  describe('acceptApplication', () => {
    it('should accept an application and assign a room', async () => {
      const application = {
        application_id: 1,
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        home_address: '123 Main St',
        phone_number: '1234567890',
        email: 'john.doe@example.com',
        home_city: 'Kyiv',
        home_region: 'Kyiv Region',
        home_campus_number: '1',
        home_street_number: '123',
      };
      const room = { room_id: 1, dormitory_id: 1 };
      const student = { student_id: 1 };
      mockApplicationService.getApplicationById.mockResolvedValue(application);
      mockDormitoryService.getRoomById.mockResolvedValue(room);
      mockStudentService.createStudent.mockResolvedValue(student);
      mockAssignRoom.execute.mockResolvedValue();
      mockApplicationService.deleteApplication.mockResolvedValue();

      await superintendentService.acceptApplication(1, '1', 1);

      expect(mockApplicationService.getApplicationById).toHaveBeenCalledWith(1);
      expect(mockDormitoryService.getRoomById).toHaveBeenCalledWith(1);
      expect(mockStudentService.createStudent).toHaveBeenCalledWith({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        home_address: '123 Main St',
        phone_number: '1234567890',
        email: 'john.doe@example.com',
        home_city: 'Kyiv',
        home_region: 'Kyiv Region',
        home_campus_number: '1',
        home_street_number: '123',
      });
      expect(mockAssignRoom.execute).toHaveBeenCalledWith(1, '1', 1);
      expect(mockApplicationService.deleteApplication).toHaveBeenCalledWith(1);
    });

    it('should throw an error if application or room is invalid', async () => {
      mockApplicationService.getApplicationById.mockResolvedValue(null);

      await expect(superintendentService.acceptApplication(1, '1', 1)).rejects.toThrow('Невірна заявка або кімната');

      expect(mockApplicationService.getApplicationById).toHaveBeenCalledWith(1);
      expect(mockDormitoryService.getRoomById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if room does not belong to dormitory', async () => {
      const application = { application_id: 1 };
      const room = { room_id: 1, dormitory_id: 2 };
      mockApplicationService.getApplicationById.mockResolvedValue(application);
      mockDormitoryService.getRoomById.mockResolvedValue(room);

      await expect(superintendentService.acceptApplication(1, '1', 1)).rejects.toThrow('Невірна заявка або кімната');
    });
  });

  describe('rejectApplication', () => {
    it('should reject an application', async () => {
      mockApplicationService.deleteApplication.mockResolvedValue();

      await superintendentService.rejectApplication(1);

      expect(mockApplicationService.deleteApplication).toHaveBeenCalledWith(1);
    });
  });

  describe('authenticate', () => {
    it('should authenticate a superintendent with valid credentials', async () => {
      const superintendent = {
        superintendent_id: 1,
        email: 'super@example.com',
        password_hash: 'hashed_password',
      };
      mockSuperintendentRepository.findByEmail.mockResolvedValue(superintendent);
      bcrypt.compare.mockResolvedValue(true);

      const result = await superintendentService.authenticate('super@example.com', 'password');

      expect(mockSuperintendentRepository.findByEmail).toHaveBeenCalledWith('super@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password');
      expect(result).toEqual(superintendent);
    });

    it('should throw an error for invalid email', async () => {
      mockSuperintendentRepository.findByEmail.mockResolvedValue(null);

      await expect(superintendentService.authenticate('wrong@example.com', 'password')).rejects.toThrow('Невірний email або пароль');
    });

    it('should throw an error for invalid password', async () => {
      const superintendent = {
        superintendent_id: 1,
        email: 'super@example.com',
        password_hash: 'hashed_password',
      };
      mockSuperintendentRepository.findByEmail.mockResolvedValue(superintendent);
      bcrypt.compare.mockResolvedValue(false);

      await expect(superintendentService.authenticate('super@example.com', 'wrong')).rejects.toThrow('Невірний email або пароль');
    });
  });

  describe('searchStudents', () => {
    it('should search students with given criteria', async () => {
      const criteria = {
        lastName: 'Doe',
        firstName: 'John',
        dormitory_id: 1,
      };
      const mockStudents = [
        {
          first_name: 'John',
          middle_name: 'M',
          last_name: 'Doe',
          date_of_birth: '2000-01-01',
          Occupancies: [
            {
              Room: {
                room_number: 101,
                Dormitory: {
                  name: 'Dorm A',
                },
              },
            },
          ],
        },
      ];
      mockStudentService.getAllStudents.mockResolvedValue(mockStudents);
      jest.spyOn(superintendentService, 'formatResidentData').mockReturnValue({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        dormitory_name: 'Dorm A',
        room_number: 101,
      });

      const result = await superintendentService.searchStudents(criteria);

      expect(mockStudentService.getAllStudents).toHaveBeenCalledWith({
        where: {
          last_name: { [Op.iLike]: '%Doe%' },
          first_name: { [Op.iLike]: '%John%' },
        },
        include: [
          {
            model: StudentOccupancy,
            as: 'Occupancies',
            attributes: [],
            required: false,
            include: [
              {
                model: Room,
                as: 'Room',
                attributes: ['room_number'],
                where: null,
                include: [
                  {
                    model: Dormitory,
                    as: 'Dormitory',
                    attributes: ['name'],
                    where: { dormitory_id: 1 },
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(superintendentService.formatResidentData).toHaveBeenCalledWith(mockStudents[0]); // Fixed line
      expect(result).toEqual([
        {
          first_name: 'John',
          middle_name: 'M',
          last_name: 'Doe',
          date_of_birth: '2000-01-01',
          dormitory_name: 'Dorm A',
          room_number: 101,
        },
      ]);
    });
  });
});