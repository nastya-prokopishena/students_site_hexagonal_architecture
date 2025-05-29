const AssignRoom = require('../../../application/use-cases/AssignRoom');
const { StudentOccupancy } = require('../../../infrastructure/database/models');

// Mock dependencies
jest.mock('../../../infrastructure/database/models');
jest.mock('../../../application/services/StudentService');
jest.mock('../../../application/services/DormitoryService');

describe('AssignRoom', () => {
  let assignRoom;
  let mockStudentService;
  let mockDormitoryService;
  let mockStudentOccupancy;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock services
    mockStudentService = {
      getStudentById: jest.fn(),
    };
    mockDormitoryService = {
      getDormitoryById: jest.fn(),
      getRoomById: jest.fn(),
    };

    // Mock StudentOccupancy model
    mockStudentOccupancy = {
      create: jest.fn(),
    };
    StudentOccupancy.create = mockStudentOccupancy.create;

    // Instantiate AssignRoom with mocked services
    assignRoom = new AssignRoom(mockStudentService, mockDormitoryService);

    // Set up fake timers with a fixed date
    jest.useFakeTimers().setSystemTime(new Date('2025-05-28T00:00:00Z'));
  });

  afterEach(() => {
    // Restore timers
    jest.useRealTimers();
  });

  describe('execute', () => {
    it('should assign a room to a student with correct lease dates', async () => {
      const studentId = 1;
      const dormitoryId = 2;
      const roomId = 101;

      const expectedOccupancy = {
        student_id: studentId,
        dormitory_id: dormitoryId,
        room_id: roomId,
        lease_start_date: new Date('2025-09-01T00:00:00Z'),
        lease_term: 10,
        lease_end_date: new Date('2026-07-01T00:00:00Z'),
        payment_id: 1,
      };

      mockStudentOccupancy.create.mockResolvedValue(expectedOccupancy);

      await assignRoom.execute(studentId, dormitoryId, roomId);

      expect(mockStudentOccupancy.create).toHaveBeenCalledWith(expectedOccupancy);
    });

    it('should throw an error if StudentOccupancy.create fails', async () => {
      const studentId = 1;
      const dormitoryId = 2;
      const roomId = 101;
      const error = new Error('Database error');

      mockStudentOccupancy.create.mockRejectedValue(error);

      await expect(assignRoom.execute(studentId, dormitoryId, roomId)).rejects.toThrow('Database error');
      expect(mockStudentOccupancy.create).toHaveBeenCalled();
    });
  });
});