const SpecialtyService = require('../../../application/services/SpecialtyService');
const SpecialtyRepository = require('../../../infrastructure/repositories/SpecialtyRepository');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/SpecialtyRepository');
jest.mock('../../../infrastructure/database/models');

describe('SpecialtyService', () => {
  let specialtyService;
  let mockSpecialtyRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockSpecialtyRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByFacultyId: jest.fn(),
    };
    specialtyService = new SpecialtyService(mockSpecialtyRepository);

    // Mock console methods to prevent logging in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('getSpecialties', () => {
    it('should fetch all specialties using the repository', async () => {
      const specialties = [
        { specialty_id: 1, name: 'Computer Science' },
        { specialty_id: 2, name: 'Mathematics' },
      ];
      SpecialtyRepository.findAll.mockResolvedValue(specialties);

      const result = await SpecialtyService.getSpecialties();

      expect(SpecialtyRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(specialties);
      expect(console.log).toHaveBeenCalledWith('Fetching all specialties');
      expect(console.log).toHaveBeenCalledWith('Specialties result:', specialties);
    });

    it('should throw an error if repository fails', async () => {
      const error = new Error('Database error');
      SpecialtyRepository.findAll.mockRejectedValue(error);

      await expect(SpecialtyService.getSpecialties()).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith('Error in getSpecialties:', error.message, error.stack);
    });
  });

  describe('getSpecialtyById', () => {
    it('should fetch a specialty by ID', async () => {
      const specialty = { specialty_id: 1, name: 'Computer Science' };
      mockSpecialtyRepository.findById.mockResolvedValue(specialty);

      const result = await specialtyService.getSpecialtyById(1);

      expect(mockSpecialtyRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(specialty);
    });

    it('should throw an error if repository findById fails', async () => {
      const error = new Error('Specialty not found');
      mockSpecialtyRepository.findById.mockRejectedValue(error);

      await expect(specialtyService.getSpecialtyById(1)).rejects.toThrow('Specialty not found');
      expect(mockSpecialtyRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('getSpecialtiesByFaculty', () => {
    it('should fetch specialties by faculty ID', async () => {
      const facultyId = 1;
      const specialties = [
        { specialty_id: 1, name: 'Computer Science', faculty_id: 1 },
        { specialty_id: 2, name: 'Software Engineering', faculty_id: 1 },
      ];
      mockSpecialtyRepository.findByFacultyId.mockImplementation(async (id) => {
        console.log('Fetching specialties for faculty_id:', id);
        console.log('Specialties found:', specialties);
        return specialties;
      });

      const result = await specialtyService.getSpecialtiesByFaculty(facultyId);

      expect(mockSpecialtyRepository.findByFacultyId).toHaveBeenCalledWith(facultyId);
      expect(result).toEqual(specialties);
      expect(console.log).toHaveBeenCalledWith('Getting specialties for faculty:', facultyId);
      expect(console.log).toHaveBeenCalledWith('Fetching specialties for faculty_id:', facultyId);
      expect(console.log).toHaveBeenCalledWith('Specialties found:', specialties);
    });

    it('should throw an error if repository findByFacultyId fails', async () => {
      const facultyId = 1;
      const error = new Error('Database error');
      mockSpecialtyRepository.findByFacultyId.mockImplementation(async (id) => {
        console.log('Fetching specialties for faculty_id:', id);
        throw error;
      });

      await expect(specialtyService.getSpecialtiesByFaculty(facultyId)).rejects.toThrow('Database error');
      expect(mockSpecialtyRepository.findByFacultyId).toHaveBeenCalledWith(facultyId);
      expect(console.log).toHaveBeenCalledWith('Getting specialties for faculty:', facultyId);
      expect(console.log).toHaveBeenCalledWith('Fetching specialties for faculty_id:', facultyId);
    });
  });
});