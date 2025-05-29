const request = require('supertest');
const express = require('express');
const PriceController = require('../../interfaces/web/controllers/priceController');
const PriceService = require('../../application/services/PriceService');

const app = express();
app.use(express.json());
app.get('/api/prices', PriceController.getPrices);

jest.mock('../../application/services/PriceService', () => jest.fn().mockImplementation(() => ({
  getPrices: jest.fn(),
})));

describe('PriceController', () => {
  let mockPriceService;

  beforeEach(() => {
    mockPriceService = { getPrices: jest.fn() };
    PriceService.mockImplementation(() => mockPriceService);
    jest.clearAllMocks();
  });

  describe('getPrices', () => {
    test('should return 200 and list of prices', async () => {
      const prices = [{ price_id: 1, amount: 100 }];
      mockPriceService.getPrices.mockResolvedValue(prices);

      const response = await request(app).get('/api/prices');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(prices);
      expect(mockPriceService.getPrices).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockPriceService.getPrices.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/prices');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error', details: 'Database error' });
    });
  });
});