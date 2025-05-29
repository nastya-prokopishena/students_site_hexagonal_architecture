const BenefitService = require('../../../application/services/BenefitService');
const BenefitRepository = require('../../../infrastructure/repositories/BenefitRepository');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/BenefitRepository');
jest.mock('../../../infrastructure/database/models');

describe('BenefitService', () => {
  let benefitService;
  let mockBenefitRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockBenefitRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    // Instantiate service with mocked repository
    benefitService = new BenefitService(mockBenefitRepository);

    // Mock console methods to prevent logging in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('getBenefits', () => {
    it('should fetch all benefits using the repository', async () => {
      const mockBenefits = [
        { benefit_id: 1, name: 'Scholarship' },
        { benefit_id: 2, name: 'Free Meals' },
      ];
      BenefitRepository.findAll.mockResolvedValue(mockBenefits);

      const result = await BenefitService.getBenefits();

      expect(BenefitRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBenefits);
      expect(console.log).toHaveBeenCalledWith('Fetching all benefits');
      expect(console.log).toHaveBeenCalledWith('Benefits result:', mockBenefits);
    });

    it('should throw an error if repository findAll fails', async () => {
      const error = new Error('Database error');
      BenefitRepository.findAll.mockRejectedValue(error);

      await expect(BenefitService.getBenefits()).rejects.toThrow('Database error');
      expect(BenefitRepository.findAll).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Fetching all benefits');
      expect(console.error).toHaveBeenCalledWith('Error in getBenefits:', error.message, error.stack);
    });
  });

  describe('getBenefitById', () => {
    it('should fetch a benefit by ID', async () => {
      const benefitId = 1;
      const mockBenefit = { benefit_id: 1, name: 'Scholarship' };
      mockBenefitRepository.findById.mockResolvedValue(mockBenefit);

      const result = await benefitService.getBenefitById(benefitId);

      expect(mockBenefitRepository.findById).toHaveBeenCalledWith(benefitId);
      expect(result).toEqual(mockBenefit);
    });

    it('should return null if benefit is not found', async () => {
      const benefitId = 999;
      mockBenefitRepository.findById.mockResolvedValue(null);

      const result = await benefitService.getBenefitById(benefitId);

      expect(mockBenefitRepository.findById).toHaveBeenCalledWith(benefitId);
      expect(result).toBeNull();
    });

    it('should throw an error if repository findById fails', async () => {
      const benefitId = 1;
      const error = new Error('Database error');
      mockBenefitRepository.findById.mockRejectedValue(error);

      await expect(benefitService.getBenefitById(benefitId)).rejects.toThrow('Database error');
      expect(mockBenefitRepository.findById).toHaveBeenCalledWith(benefitId);
    });
  });

  describe('createBenefit', () => {
    it('should create a benefit with the provided data', async () => {
      const benefitData = { name: 'New Benefit' };
      const createdBenefit = { benefit_id: 3, name: 'New Benefit' };
      mockBenefitRepository.create.mockResolvedValue(createdBenefit);

      const result = await benefitService.createBenefit(benefitData);

      expect(mockBenefitRepository.create).toHaveBeenCalledWith(benefitData);
      expect(result).toEqual(createdBenefit);
    });

    it('should throw an error if repository create fails', async () => {
      const benefitData = { name: 'New Benefit' };
      const error = new Error('Database error');
      mockBenefitRepository.create.mockRejectedValue(error);

      await expect(benefitService.createBenefit(benefitData)).rejects.toThrow('Database error');
      expect(mockBenefitRepository.create).toHaveBeenCalledWith(benefitData);
    });
  });
});