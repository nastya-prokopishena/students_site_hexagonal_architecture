const request = require('supertest');
const express = require('express');
const SpecialtyController = require('../../interfaces/web/controllers/specialtyController');
const SpecialtyService = require('../../application/services/SpecialtyService');

// 🔧 Правильне мокання методу без заміни всього модуля
jest.spyOn(SpecialtyService, 'getSpecialties');

const app = express();
app.use(express.json());
app.get('/api/specialties', SpecialtyController.getSpecialties);

describe('SpecialtyController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSpecialties', () => {
    test('should return 200 and list of specialties', async () => {
      const specialties = [{ specialty_id: 1, name: 'Computer Science' }];
      SpecialtyService.getSpecialties.mockResolvedValue(specialties);

      const response = await request(app).get('/api/specialties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(specialties);
      expect(SpecialtyService.getSpecialties).toHaveBeenCalledTimes(1);
    });

    test('should return 200 and empty array if no specialties', async () => {
      SpecialtyService.getSpecialties.mockResolvedValue(null);

      const response = await request(app).get('/api/specialties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(SpecialtyService.getSpecialties).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      SpecialtyService.getSpecialties.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/specialties');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Помилка сервера: Database error' });
      expect(SpecialtyService.getSpecialties).toHaveBeenCalledTimes(1);
    });
  });
});
