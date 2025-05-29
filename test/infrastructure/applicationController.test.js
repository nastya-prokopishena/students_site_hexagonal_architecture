const request = require('supertest');
const express = require('express');
const applicationController = require('../../interfaces/web/controllers/applicationController');
const ApplicationService = require('../../application/services/ApplicationService');
const { Application, Faculty, Room, StudentOccupancy } = require('../../infrastructure/database/models');

// Налаштування Express для тестування
const app = express();
app.use(express.json());
app.post('/applications/submit', applicationController.submitApplication);
app.get('/applications', applicationController.getAllApplications);
app.post('/accept_application', applicationController.acceptApplication);
app.delete('/reject_application/:application_id', applicationController.rejectApplication);

// Мокаємо ApplicationService і моделі
jest.mock('../../application/services/ApplicationService');
jest.mock('../../infrastructure/database/models', () => ({
  Application: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Faculty: { findOne: jest.fn() },
  Specialty: { findOne: jest.fn() },
  Benefit: { findOne: jest.fn() },
  Student: { create: jest.fn() },
  Room: { findOne: jest.fn() },
  StudentOccupancy: { create: jest.fn(), count: jest.fn() },
}));

describe('applicationController', () => {
  let mockApplicationService;

  beforeEach(() => {
    // Ініціалізуємо мок для ApplicationService
    mockApplicationService = {
      submit: jest.fn(),
      getAllApplications: jest.fn(),
      deleteApplication: jest.fn(),
    };
    ApplicationService.mockImplementation(() => mockApplicationService);
    jest.clearAllMocks();
  });

  describe('submitApplication', () => {
    test('should return 400 for invalid IDs', async () => {
      // Мокаємо невалідні дані
      const applicationData = {
        first_name: 'John',
        last_name: 'Doe',
        faculty_name: 'invalid',
        specialty_name: '2',
        benefit_name: '3',
      };

      // Виконуємо запит
      const response = await request(app)
        .post('/applications/submit')
        .send(applicationData);

      // Перевіряємо результат
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Невірні або відсутні ID для факультету, спеціальності або пільги.',
      });
      expect(mockApplicationService.submit).not.toHaveBeenCalled();
    });

    test('should return 400 if faculty, specialty, or benefit not found', async () => {
      // Мокаємо вхідні дані
      const applicationData = {
        first_name: 'John',
        last_name: 'Doe',
        faculty_name: '1',
        specialty_name: '2',
        benefit_name: '3',
      };

      // Мокаємо відсутність факультету
      Faculty.findOne.mockResolvedValue(null);

      // Виконуємо запит
      const response = await request(app)
        .post('/applications/submit')
        .send(applicationData);

      // Перевіряємо результат
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Невірні або відсутні дані для створення заявки.',
      });
      expect(mockApplicationService.submit).not.toHaveBeenCalled();
    });
  });

  describe('acceptApplication', () => {
    test('should return 400 if required fields are missing', async () => {
      // Мокаємо невалідні дані
      const acceptData = { application_id: 1 };

      // Виконуємо запит
      const response = await request(app)
        .post('/accept_application')
        .send(acceptData);

      // Перевіряємо результат
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Не всі дані були надіслані' });
    });

    test('should return 404 if application not found', async () => {
      // Мокаємо вхідні дані
      const acceptData = {
        application_id: 1,
        dormitory_id: 1,
        room_id: 1,
      };

      // Мокаємо відсутність заявки
      Application.findOne.mockResolvedValue(null);

      // Виконуємо запит
      const response = await request(app)
        .post('/accept_application')
        .send(acceptData);

      // Перевіряємо результат
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Заявка не знайдена' });
    });

    test('should return 400 if room is full', async () => {
      // Мокаємо вхідні дані
      const acceptData = {
        application_id: 1,
        dormitory_id: 1,
        room_id: 1,
      };

      // Мокаємо перевірку даних
      Application.findOne.mockResolvedValue({ application_id: 1 });
      Room.findOne.mockResolvedValue({ room_id: 1, dormitory_id: 1 });
      StudentOccupancy.count.mockResolvedValue(4); // Кімната заповнена

      // Виконуємо запит
      const response = await request(app)
        .post('/accept_application')
        .send(acceptData);

      // Перевіряємо результат
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Кімната заповнена' });
    });
  });

  describe('rejectApplication', () => {
    test('should return 404 if application not found', async () => {
      // Мокаємо відсутність заявки
      Application.findOne.mockResolvedValue(null);

      // Виконуємо запит
      const response = await request(app).delete('/reject_application/1');

      // Перевіряємо результат
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Заявка не знайдена' });
    });
  });
});