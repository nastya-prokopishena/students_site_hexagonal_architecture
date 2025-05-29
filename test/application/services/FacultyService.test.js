const FacultyService = require('../../../application/services/FacultyService');
const FacultyRepository = require('../../../infrastructure/repositories/FacultyRepository');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/FacultyRepository');
jest.mock('../../../infrastructure/database/models');

describe('FacultyService', () => {
  let facultyService;
  let mockFacultyRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockFacultyRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Instantiate service with mocked repository
    facultyService = new FacultyService(mockFacultyRepository);

    // Mock console methods to prevent logging in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('getFaculties', () => {
    it('should fetch all faculties using the repository', async () => {
      const mockFaculties = [
        { faculty_id: 1, name: 'Engineering' },
        { faculty_id: 2, name: 'Mathematics' },
      ];
      FacultyRepository.findAll.mockResolvedValue(mockFaculties);

      const result = await FacultyService.getFaculties();

      expect(FacultyRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFaculties);
      expect(console.log).toHaveBeenCalledWith('Fetching all faculties');
      expect(console.log).toHaveBeenCalledWith('Faculties result:', mockFaculties);
    });

    it('should throw an error if repository findAll fails', async () => {
      const error = new Error('Database error');
      FacultyRepository.findAll.mockRejectedValue(error);

      await expect(FacultyService.getFaculties()).rejects.toThrow('Database error');
      expect(FacultyRepository.findAll).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Fetching all faculties');
      expect(console.error).toHaveBeenCalledWith('Error in getFaculties:', error.message, error.stack);
    });
  });

  describe('getFacultyById', () => {
    it('should fetch a faculty by ID', async () => {
      const facultyId = 1;
      const mockFaculty = { faculty_id: 1, name: 'Engineering' };
      mockFacultyRepository.findById.mockResolvedValue(mockFaculty);

      const result = await facultyService.getFacultyById(facultyId);

      expect(mockFacultyRepository.findById).toHaveBeenCalledWith(facultyId);
      expect(result).toEqual(mockFaculty);
    });

    it('should return null if faculty is not found', async () => {
      const facultyId = 999;
      mockFacultyRepository.findById.mockResolvedValue(null);

      const result = await facultyService.getFacultyById(facultyId);

      expect(mockFacultyRepository.findById).toHaveBeenCalledWith(facultyId);
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      const facultyId = 1;
      const error = new Error('Database error');
      mockFacultyRepository.findById.mockRejectedValue(error);

      await expect(facultyService.getFacultyById(facultyId)).rejects.toThrow('Database error');
      expect(mockFacultyRepository.findById).toHaveBeenCalledWith(facultyId);
    });
  });

  describe('createFaculty', () => {
    it('should create a faculty with the provided data', async () => {
      const facultyData = { name: 'Computer Science' };
      const createdFaculty = { faculty_id: 1, name: 'Computer Science' };
      mockFacultyRepository.create.mockResolvedValue(createdFaculty);

      const result = await facultyService.createFaculty(facultyData);

      expect(mockFacultyRepository.create).toHaveBeenCalledWith(facultyData);
      expect(result).toEqual(createdFaculty);
    });

    it('should throw an error if repository create fails', async () => {
      const facultyData = { name: 'Computer Science' };
      const error = new Error('Database error');
      mockFacultyRepository.create.mockRejectedValue(error);

      await expect(facultyService.createFaculty(facultyData)).rejects.toThrow('Database error');
      expect(mockFacultyRepository.create).toHaveBeenCalledWith(facultyData);
    });
  });

  describe('updateFaculty', () => {
    it('should update a faculty with the provided data', async () => {
      const facultyId = 1;
      const facultyData = { name: 'Updated Engineering' };
      const updatedFaculty = { faculty_id: 1, name: 'Updated Engineering' };
      mockFacultyRepository.update.mockResolvedValue(updatedFaculty);

      const result = await facultyService.updateFaculty(facultyId, facultyData);

      expect(mockFacultyRepository.update).toHaveBeenCalledWith(facultyId, facultyData);
      expect(result).toEqual(updatedFaculty);
    });

    it('should return null if faculty is not found', async () => {
      const facultyId = 999;
      const facultyData = { name: 'Updated Engineering' };
      mockFacultyRepository.update.mockResolvedValue(null);

      const result = await facultyService.updateFaculty(facultyId, facultyData);

      expect(mockFacultyRepository.update).toHaveBeenCalledWith(facultyId, facultyData);
      expect(result).toBeNull();
    });

    it('should throw an error if repository update fails', async () => {
      const facultyId = 1;
      const facultyData = { name: 'Updated Engineering' };
      const error = new Error('Database error');
      mockFacultyRepository.update.mockRejectedValue(error);

      await expect(facultyService.updateFaculty(facultyId, facultyData)).rejects.toThrow('Database error');
      expect(mockFacultyRepository.update).toHaveBeenCalledWith(facultyId, facultyData);
    });
  });

  describe('deleteFaculty', () => {
    it('should delete a faculty by ID', async () => {
      const facultyId = 1;
      const deletedFaculty = { faculty_id: 1, name: 'Engineering' };
      mockFacultyRepository.delete.mockResolvedValue(deletedFaculty);

      const result = await facultyService.deleteFaculty(facultyId);

      expect(mockFacultyRepository.delete).toHaveBeenCalledWith(facultyId);
      expect(result).toEqual(deletedFaculty);
    });

    it('should return null if faculty is not found', async () => {
      const facultyId = 999;
      mockFacultyRepository.delete.mockResolvedValue(null);

      const result = await facultyService.deleteFaculty(facultyId);

      expect(mockFacultyRepository.delete).toHaveBeenCalledWith(facultyId);
      expect(result).toBeNull();
    });

    it('should throw an error if repository delete fails', async () => {
      const facultyId = 1;
      const error = new Error('Database error');
      mockFacultyRepository.delete.mockRejectedValue(error);

      await expect(facultyService.deleteFaculty(facultyId)).rejects.toThrow('Database error');
      expect(mockFacultyRepository.delete).toHaveBeenCalledWith(facultyId);
    });
  });
});