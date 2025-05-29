const DormitoryService = require('../../../application/services/DormitoryService');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/DormitoryRepository');
jest.mock('../../../domain/models/dormitory');
jest.mock('../../../domain/models/price');
jest.mock('../../../domain/models/room');

describe('DormitoryService', () => {
  let dormitoryService;
  let mockDormitoryRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockDormitoryRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findRoomsByDormitory: jest.fn(),
      findRoomById: jest.fn(),
    };

    // Instantiate service with mocked repository
    dormitoryService = new DormitoryService();
    dormitoryService.dormitoryRepository = mockDormitoryRepository;

    // Mock console methods to prevent logging in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('getDormitoryById', () => {
    it('should fetch a dormitory by ID with price', async () => {
      const dormitoryId = 1;
      const mockDormitory = {
        dormitory_id: 1,
        name: 'Dorm A',
        price_amount: 1200,
      };
      mockDormitoryRepository.findById.mockImplementation(async (id) => {
        console.log(`Querying dormitory with ID ${id}`);
        return mockDormitory;
      });

      const result = await dormitoryService.getDormitoryById(dormitoryId);

      expect(mockDormitoryRepository.findById).toHaveBeenCalledWith(dormitoryId);
      expect(result).toEqual(mockDormitory);
      expect(console.log).toHaveBeenCalledWith(`Fetching dormitory with ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying dormitory with ID ${dormitoryId}`);
    });

    it('should return null if dormitory is not found', async () => {
      const dormitoryId = 999;
      mockDormitoryRepository.findById.mockImplementation(async (id) => {
        console.log(`Querying dormitory with ID ${id}`);
        return null;
      });

      const result = await dormitoryService.getDormitoryById(dormitoryId);

      expect(mockDormitoryRepository.findById).toHaveBeenCalledWith(dormitoryId);
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(`Fetching dormitory with ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying dormitory with ID ${dormitoryId}`);
    });

    it('should throw an error if repository findById fails', async () => {
      const dormitoryId = 1;
      const error = new Error('Database error');
      mockDormitoryRepository.findById.mockImplementation(async (id) => {
        console.log(`Querying dormitory with ID ${id}`);
        throw error;
      });

      await expect(dormitoryService.getDormitoryById(dormitoryId)).rejects.toThrow('Database error');
      expect(mockDormitoryRepository.findById).toHaveBeenCalledWith(dormitoryId);
      expect(console.log).toHaveBeenCalledWith(`Fetching dormitory with ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying dormitory with ID ${dormitoryId}`);
      expect(console.error).toHaveBeenCalledWith('Error in getDormitoryById:', error.message, error.stack);
    });
  });

  describe('getAllDormitories', () => {
    it('should fetch all dormitories with prices', async () => {
      const mockDormitories = [
        { dormitory_id: 1, name: 'Dorm A', price_amount: 1200 },
        { dormitory_id: 2, name: 'Dorm B', price_amount: 800 },
      ];
      mockDormitoryRepository.findAll.mockImplementation(async () => {
        console.log('Querying all dormitories');
        return mockDormitories;
      });

      const result = await dormitoryService.getAllDormitories();

      expect(mockDormitoryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDormitories);
      expect(console.log).toHaveBeenCalledWith('Fetching all dormitories');
      expect(console.log).toHaveBeenCalledWith('Querying all dormitories');
    });

    it('should throw an error if repository findAll fails', async () => {
      const error = new Error('Database error');
      mockDormitoryRepository.findAll.mockImplementation(async () => {
        console.log('Querying all dormitories');
        throw error;
      });

      await expect(dormitoryService.getAllDormitories()).rejects.toThrow('Database error');
      expect(mockDormitoryRepository.findAll).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Fetching all dormitories');
      expect(console.log).toHaveBeenCalledWith('Querying all dormitories');
      expect(console.error).toHaveBeenCalledWith('Error in getAllDormitories:', error.message, error.stack);
    });
  });

  describe('getRoomsByDormitory', () => {
    it('should fetch rooms for a dormitory', async () => {
      const dormitoryId = 1;
      const mockRooms = [
        { room_id: 101, room_number: '101', dormitory_id: 1 },
        { room_id: 102, room_number: '102', dormitory_id: 1 },
      ];
      mockDormitoryRepository.findRoomsByDormitory.mockImplementation(async (id) => {
        console.log(`Querying rooms for dormitory ID ${id}`);
        return mockRooms;
      });

      const result = await dormitoryService.getRoomsByDormitory(dormitoryId);

      expect(mockDormitoryRepository.findRoomsByDormitory).toHaveBeenCalledWith(dormitoryId);
      expect(result).toEqual(mockRooms);
      expect(console.log).toHaveBeenCalledWith(`Fetching rooms for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying rooms for dormitory ID ${dormitoryId}`);
    });

    it('should return empty array if no rooms are found', async () => {
      const dormitoryId = 999;
      mockDormitoryRepository.findRoomsByDormitory.mockImplementation(async (id) => {
        console.log(`Querying rooms for dormitory ID ${id}`);
        return [];
      });

      const result = await dormitoryService.getRoomsByDormitory(dormitoryId);

      expect(mockDormitoryRepository.findRoomsByDormitory).toHaveBeenCalledWith(dormitoryId);
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith(`Fetching rooms for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying rooms for dormitory ID ${dormitoryId}`);
    });

    it('should throw an error if repository findRoomsByDormitory fails', async () => {
      const dormitoryId = 1;
      const error = new Error('Database error');
      mockDormitoryRepository.findRoomsByDormitory.mockImplementation(async (id) => {
        console.log(`Querying rooms for dormitory ID ${id}`);
        throw error;
      });

      await expect(dormitoryService.getRoomsByDormitory(dormitoryId)).rejects.toThrow('Database error');
      expect(mockDormitoryRepository.findRoomsByDormitory).toHaveBeenCalledWith(dormitoryId);
      expect(console.log).toHaveBeenCalledWith(`Fetching rooms for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying rooms for dormitory ID ${dormitoryId}`);
      expect(console.error).toHaveBeenCalledWith('Error in getRoomsByDormitory:', error.message, error.stack);
    });
  });

  describe('getRoomById', () => {
    it('should fetch a room by ID', async () => {
      const roomId = 101;
      const mockRoom = { room_id: 101, room_number: '101', dormitory_id: 1 };
      mockDormitoryRepository.findRoomById.mockResolvedValue(mockRoom);

      const result = await dormitoryService.getRoomById(roomId);

      expect(mockDormitoryRepository.findRoomById).toHaveBeenCalledWith(roomId);
      expect(result).toEqual(mockRoom);
    });

    it('should return null if room is not found', async () => {
      const roomId = 999;
      mockDormitoryRepository.findRoomById.mockResolvedValue(null);

      const result = await dormitoryService.getRoomById(roomId);

      expect(mockDormitoryRepository.findRoomById).toHaveBeenCalledWith(roomId);
      expect(result).toBeNull();
    });

    it('should throw an error if repository findRoomById fails', async () => {
      const roomId = 101;
      const error = new Error('Database error');
      mockDormitoryRepository.findRoomById.mockRejectedValue(error);

      await expect(dormitoryService.getRoomById(roomId)).rejects.toThrow('Database error');
      expect(mockDormitoryRepository.findRoomById).toHaveBeenCalledWith(roomId);
    });
  });
});