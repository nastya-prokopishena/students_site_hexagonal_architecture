const request = require('supertest');
const express = require('express');
const SelectDataController = require('../../interfaces/web/controllers/selectDataController');

const app = express();
app.use(express.json());
const mockSelectDataService = {
  getFaculties: jest.fn(),
  getSpecialtiesByFacultyId: jest.fn(),
  getBenefits: jest.fn(),
};
const controller = new SelectDataController(mockSelectDataService);
app.get('/api/faculties', controller.getFaculties.bind(controller));
app.get('/api/specialties/:facultyId', controller.getSpecialties.bind(controller));
app.get('/api/benefits', controller.getBenefits.bind(controller));

describe('SelectDataController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFaculties', () => {
    test('should return 200 and list of faculties', async () => {
      const faculties = [{ faculty_id: 1, name: 'Engineering' }];
      mockSelectDataService.getFaculties.mockResolvedValue(faculties);

      const response = await request(app).get('/api/faculties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(faculties);
      expect(mockSelectDataService.getFaculties).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockSelectDataService.getFaculties.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/faculties');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('getSpecialties', () => {
    test('should return 200 and list of specialties', async () => {
      const specialties = [{ specialty_id: 1, name: 'Computer Science' }];
      mockSelectDataService.getSpecialtiesByFacultyId.mockResolvedValue(specialties);

      const response = await request(app).get('/api/specialties/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(specialties);
      expect(mockSelectDataService.getSpecialtiesByFacultyId).toHaveBeenCalledWith('1');
    });

    test('should return 500 if service throws an error', async () => {
      mockSelectDataService.getSpecialtiesByFacultyId.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/specialties/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('getBenefits', () => {
    test('should return 200 and list of benefits', async () => {
      const benefits = [{ benefit_id: 1, name: 'Scholarship' }];
      mockSelectDataService.getBenefits.mockResolvedValue(benefits);

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(benefits);
      expect(mockSelectDataService.getBenefits).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockSelectDataService.getBenefits.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});