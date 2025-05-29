const request = require('supertest');
const express = require('express');
const DormitoryController = require('../../interfaces/web/controllers/dormitoryController');
const DormitoryService = require('../../application/services/DormitoryService');

const app = express();
app.use(express.json());
app.get('/api/dormitories', DormitoryController.getAllDormitories);
app.get('/api/dormitories/:id', DormitoryController.getDormitoryById);
app.get('/api/rooms/:dormitoryId', DormitoryController.getRoomsByDormitory);

jest.mock('../../application/services/DormitoryService', () => jest.fn().mockImplementation(() => ({
  getAllDormitories: jest.fn(),
  getDormitoryById: jest.fn(),
  getRoomsByDormitory: jest.fn(),
})));

describe('DormitoryController', () => {
  let mockDormitoryService;

  beforeEach(() => {
    mockDormitoryService = {
      getAllDormitories: jest.fn(),
      getDormitoryById: jest.fn(),
      getRoomsByDormitory: jest.fn(),
    };
    DormitoryService.mockImplementation(() => mockDormitoryService);
    jest.clearAllMocks();
  });

  describe('getAllDormitories', () => {
    test('should return 200 and list of dormitories', async () => {
      const dormitories = [{ dormitory_id: 1, name: 'Dorm A' }];
      mockDormitoryService.getAllDormitories.mockResolvedValue(dormitories);

      const response = await request(app).get('/api/dormitories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dormitories);
      expect(mockDormitoryService.getAllDormitories).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if service throws an error', async () => {
      mockDormitoryService.getAllDormitories.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/dormitories');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error', details: 'Database error' });
    });
  });

  describe('getDormitoryById', () => {
    test('should return 200 and dormitory data', async () => {
      const dormitory = { dormitory_id: 1, name: 'Dorm A' };
      mockDormitoryService.getDormitoryById.mockResolvedValue(dormitory);

      const response = await request(app).get('/api/dormitories/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(dormitory);
      expect(mockDormitoryService.getDormitoryById).toHaveBeenCalledWith('1');
    });

    test('should return 404 if dormitory not found', async () => {
      mockDormitoryService.getDormitoryById.mockResolvedValue(null);

      const response = await request(app).get('/api/dormitories/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Dormitory not found' });
    });

    test('should return 500 if service throws an error', async () => {
      mockDormitoryService.getDormitoryById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/dormitories/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Server error: Database error' });
    });
  });

  describe('getRoomsByDormitory', () => {
    test('should return 200 and list of rooms', async () => {
      const rooms = [{ room_id: 1, room_number: '101' }];
      mockDormitoryService.getRoomsByDormitory.mockResolvedValue(rooms);

      const response = await request(app).get('/api/rooms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(rooms);
      expect(mockDormitoryService.getRoomsByDormitory).toHaveBeenCalledWith('1');
    });

    test('should return 200 and empty array if no rooms', async () => {
      mockDormitoryService.getRoomsByDormitory.mockResolvedValue(null);

      const response = await request(app).get('/api/rooms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockDormitoryService.getRoomsByDormitory).toHaveBeenCalledWith('1');
    });

    test('should return 500 if service throws an error', async () => {
      mockDormitoryService.getRoomsByDormitory.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/rooms/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Server error: Database error' });
    });
  });
});