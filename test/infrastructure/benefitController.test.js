const request = require('supertest');
const express = require('express');
const BenefitController = require('../../interfaces/web/controllers/benefitController');
const BenefitService = require('../../application/services/BenefitService');

const app = express();
app.use(express.json());
app.get('/api/benefits', BenefitController.getBenefits);

jest.mock('../../application/services/BenefitService');

describe('BenefitController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBenefits', () => {
    test('should return 200 and list of benefits', async () => {
      const benefits = [{ benefit_id: 1, name: 'Scholarship' }];
      BenefitService.getBenefits.mockResolvedValue(benefits);

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(benefits);
      expect(BenefitService.getBenefits).toHaveBeenCalledTimes(1);
    });

    test('should return 200 and empty array if no benefits', async () => {
      BenefitService.getBenefits.mockResolvedValue(null);

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(BenefitService.getBenefits).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      BenefitService.getBenefits.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Помилка сервера: Database error' });
      expect(BenefitService.getBenefits).toHaveBeenCalledTimes(1);
    });
  });
});