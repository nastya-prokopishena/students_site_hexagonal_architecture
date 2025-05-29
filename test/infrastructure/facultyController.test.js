const request = require('supertest');
const express = require('express');
const FacultyController = require('../../interfaces/web/controllers/facultyController');
const FacultyService = require('../../application/services/FacultyService');

const app = express();
app.use(express.json());
app.get('/api/fetch-select-data/faculties', FacultyController.getFaculties);

jest.mock('../../application/services/FacultyService');

describe('FacultyController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFaculties', () => {
    test('should return 200 and list of faculties', async () => {
      const faculties = [{ faculty_id: 1, name: 'Engineering' }];
      FacultyService.getFaculties.mockResolvedValue(faculties);

      const response = await request(app).get('/api/fetch-select-data/faculties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(faculties);
      expect(FacultyService.getFaculties).toHaveBeenCalledTimes(1);
    });

    test('should return 200 and empty array if no faculties', async () => {
      FacultyService.getFaculties.mockResolvedValue(null);

      const response = await request(app).get('/api/fetch-select-data/faculties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(FacultyService.getFaculties).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      FacultyService.getFaculties.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/fetch-select-data/faculties');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Помилка сервера: Database error' });
      expect(FacultyService.getFaculties).toHaveBeenCalledTimes(1);
    });
  });
});