// application/services/DormitoryService.js
const DormitoryRepository = require('../../infrastructure/repositories/DormitoryRepository');

class DormitoryService {
  constructor() {
    this.dormitoryRepository = new DormitoryRepository();
  }

  async getDormitoryById(id) {
    console.log(`Fetching dormitory with ID ${id}`);
    try {
      return await this.dormitoryRepository.findById(id);
    } catch (error) {
      console.error('Error in getDormitoryById:', error.message, error.stack);
      throw error;
    }
  }

  async getAllDormitories() {
    console.log('Fetching all dormitories');
    try {
      return await this.dormitoryRepository.findAll();
    } catch (error) {
      console.error('Error in getAllDormitories:', error.message, error.stack);
      throw error;
    }
  }

  async getRoomsByDormitory(dormitoryId) {
    console.log(`Fetching rooms for dormitory ID ${dormitoryId}`);
    try {
      return await this.dormitoryRepository.findRoomsByDormitory(dormitoryId);
    } catch (error) {
      console.error('Error in getRoomsByDormitory:', error.message, error.stack);
      throw error;
    }
  }
  async getRoomById(room_id) {
    return await this.dormitoryRepository.findRoomById(room_id);
  }
}

module.exports = DormitoryService;