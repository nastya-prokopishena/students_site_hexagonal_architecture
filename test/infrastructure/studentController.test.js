const request = require('supertest');
const express = require('express');
const StudentController = require('../../interfaces/web/controllers/studentController');

const app = express();
app.use(express.json());
const mockStudentService = {
  getFaculties: jest.fn(),
  getSpecialties: jest.fn(),
  getBenefits: jest.fn(),
  getDormitoryById: jest.fn(),
  submitApplication: jest.fn(),
};
const controller = new StudentController(mockStudentService);
app.get('/api/faculties', controller.getFaculties.bind(controller));
app.get('/api/specialties/:facultyId', controller.getSpecialties.bind(controller));
app.get('/api/benefits', controller.getBenefits.bind(controller));
app.get('/api/dormitories/:id', controller.getDormitory.bind(controller));
app.post('/api/applications', controller.submitApplication.bind(controller));

describe('StudentController', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe('getFaculties', () => {
    test('should return 200 and list of faculties', async () => {
      const faculties = [{ faculty_id: 1, name: 'Engineering' }];
      mockStudentService.getFaculties.mockResolvedValue(faculties);

      const response = await request(app).get('/api/faculties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(faculties);
      expect(mockStudentService.getFaculties).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockStudentService.getFaculties.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/faculties');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get faculties' });
    });
  });

  describe('getSpecialties', () => {
    test('should return 200 and list of specialties', async () => {
      const specialties = [{ specialty_id: 1, name: 'Computer Science' }];
      mockStudentService.getSpecialties.mockResolvedValue(specialties);

      const response = await request(app).get('/api/specialties/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(specialties);
      expect(mockStudentService.getSpecialties).toHaveBeenCalledWith('1');
    });

    test('should return 500 if service throws an error', async () => {
      mockStudentService.getSpecialties.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/specialties/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get specialties' });
    });
  });

  describe('getBenefits', () => {
    test('should return 200 and list of benefits', async () => {
      const benefits = [{ benefit_id: 1, name: 'Scholarship' }];
      mockStudentService.getBenefits.mockResolvedValue(benefits);

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(benefits);
      expect(mockStudentService.getBenefits).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockStudentService.getBenefits.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/benefits');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get benefits' });
    });
  });

  describe('getDormitory', () => {
    test('should return 200 and dormitory data', async () => {
      const dormitory = { dormitory_id: 1, name: 'Dorm A' };
      mockStudentService.getDormitoryById.mockResolvedValue(dormitory);

      const response = await request(app).get('/api/dormitories/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dormitory);
      expect(mockStudentService.getDormitoryById).toHaveBeenCalledWith('1');
    });

    test('should return 500 if service throws an error', async () => {
      mockStudentService.getDormitoryById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/dormitories/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get dormitory' });
    });
  });

  describe('submitApplication', () => {
    test('should return 200 and application result', async () => {
      const applicationData = { first_name: 'John', last_name: 'Doe' };
      const result = { application_id: 1 };
      mockStudentService.submitApplication.mockResolvedValue(result);

      const response = await request(app)
        .post('/api/applications')
        .send(applicationData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(result);
      expect(mockStudentService.submitApplication).toHaveBeenCalledWith(applicationData);
    });

    test('should return 400 if service throws validation error', async () => {
      const applicationData = { first_name: 'John' };
      mockStudentService.submitApplication.mockRejectedValue(new Error('Невірні дані'));

      const response = await request(app)
        .post('/api/applications')
        .send(applicationData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Невірні дані' });
    });

    test('should return 500 if service throws an error', async () => {
      const applicationData = { first_name: 'John' };
      mockStudentService.submitApplication.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/applications')
        .send(applicationData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});