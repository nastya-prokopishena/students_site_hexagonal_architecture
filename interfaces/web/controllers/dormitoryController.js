const DormitoryService = require('../../../application/services/DormitoryService');

class DormitoryController {
  static async getAllDormitories(req, res) {
    try {
      const service = new DormitoryService();
      const dormitories = await service.getAllDormitories();
      res.json(dormitories);
    } catch (error) {
      console.error('DormitoryController error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  static async getDormitoryById(req, res) {
    console.log(`Handling GET /api/dormitories/${req.params.id}`);
    try {
      const service = new DormitoryService();
      const dormitory = await service.getDormitoryById(req.params.id);
      if (!dormitory) {
        return res.status(404).json({ error: 'Dormitory not found' });
      }
      res.json(dormitory);
    } catch (error) {
      console.error('Error in getDormitoryById:', error.message, error.stack);
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  }

  static async getRoomsByDormitory(req, res) {
    console.log(`Handling GET /api/rooms/${req.params.dormitoryId}`);
    try {
      const service = new DormitoryService();
      const rooms = await service.getRoomsByDormitory(req.params.dormitoryId);
      res.json(rooms || []);
    } catch (error) {
      console.error('Error in getRoomsByDormitory:', error.message, error.stack);
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  }
}

module.exports = DormitoryController;