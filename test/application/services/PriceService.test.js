const PriceService = require('../../../application/services/PriceService');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/PriceRepository');
jest.mock('../../../domain/models/price');
jest.mock('../../../domain/models/dormitory');

describe('PriceService', () => {
  let priceService;
  let mockPriceRepository;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize mock repository
    mockPriceRepository = {
      findAll: jest.fn(),
      findByDormitoryId: jest.fn(),
    };

    // Instantiate service with mocked repository
    priceService = new PriceService();
    priceService.priceRepository = mockPriceRepository;

    // Mock console methods to prevent logging in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('getPrices', () => {
    it('should fetch all prices using the repository', async () => {
      const mockPrices = [
        { price_id: 1, price_amount: 1200 },
        { price_id: 2, price_amount: 800 },
      ];
      mockPriceRepository.findAll.mockImplementation(async () => {
        console.log('Querying all prices');
        return mockPrices;
      });

      const result = await priceService.getPrices();

      expect(mockPriceRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPrices);
      expect(console.log).toHaveBeenCalledWith('Fetching all prices');
      expect(console.log).toHaveBeenCalledWith('Querying all prices');
    });

    it('should throw an error if repository findAll fails', async () => {
      const error = new Error('Database error');
      mockPriceRepository.findAll.mockImplementation(async () => {
        console.log('Querying all prices');
        throw error;
      });

      await expect(priceService.getPrices()).rejects.toThrow('Database error');
      expect(mockPriceRepository.findAll).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Fetching all prices');
      expect(console.log).toHaveBeenCalledWith('Querying all prices');
      expect(console.error).toHaveBeenCalledWith('Error in getPrices:', error.message, error.stack);
    });
  });

  describe('getPriceByDormitoryId', () => {
    it('should fetch a price by dormitory ID', async () => {
      const dormitoryId = 1;
      const mockPrice = { price_amount: 1200 };
      mockPriceRepository.findByDormitoryId.mockImplementation(async (id) => {
        console.log(`Querying price for dormitory ID ${id}`);
        return mockPrice;
      });

      const result = await priceService.getPriceByDormitoryId(dormitoryId);

      expect(mockPriceRepository.findByDormitoryId).toHaveBeenCalledWith(dormitoryId);
      expect(result).toEqual(mockPrice);
      expect(console.log).toHaveBeenCalledWith(`Fetching price for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying price for dormitory ID ${dormitoryId}`);
    });

    it('should return null if no price is found for the dormitory ID', async () => {
      const dormitoryId = 123;
      mockPriceRepository.findByDormitoryId.mockImplementation(async (id) => {
        console.log(`Querying price for dormitory ID ${id}`);
        return null;
      });

      const result = await priceService.getPriceByDormitoryId(dormitoryId);

      expect(mockPriceRepository.findByDormitoryId).toHaveBeenCalledWith(dormitoryId);
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith(`Fetching price for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying price for dormitory ID ${dormitoryId}`);
    });

    it('should throw an error if repository findByDormitoryId fails', async () => {
      const dormitoryId = 123;
      const error = new Error('Database error');
      mockPriceRepository.findByDormitoryId.mockImplementation(async (id) => {
        console.log(`Querying price for dormitory ID ${id}`);
        throw error;
      });

      await expect(priceService.getPriceByDormitoryId(dormitoryId)).rejects.toThrow('Database error');
      expect(mockPriceRepository.findByDormitoryId).toHaveBeenCalledWith(dormitoryId);
      expect(console.log).toHaveBeenCalledWith(`Fetching price for dormitory ID ${dormitoryId}`);
      expect(console.log).toHaveBeenCalledWith(`Querying price for dormitory ID ${dormitoryId}`);
      expect(console.error).toHaveBeenCalledWith('Error in getPriceByDormitoryId:', error.message, error.stack);
    });
  });
});