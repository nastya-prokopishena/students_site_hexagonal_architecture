const Dormitory = require('../../domain/models/dormitory');
const Price = require('../../domain/models/price');

class DormitoryRepository {
  async findById(id) {
    console.log(`Querying dormitory with ID ${id}`);
    try {
      const dormitory = await Dormitory.findOne({ 
        where: { dormitory_id: id },
        include: [{ model: Price, attributes: ['price_amount'], as: 'Price' }]
      });
      const result = dormitory ? dormitory.get({ plain: true }) : null;
      if (result && result.Price) {
        result.price_amount = result.Price.price_amount;
        delete result.Price;
      }
      return result;
    } catch (error) {
      console.error('Error querying dormitory:', error.message, error.stack);
      throw error;
    }
  }

  async findAll() {
    console.log('Querying all dormitories');
    try {
      const dormitories = await Dormitory.findAll({
        include: [{ model: Price, attributes: ['price_amount'], as: 'Price' }]
      });
      
      return dormitories.map(d => {
        const dormitory = d.get({ plain: true });
        if (dormitory.Price) {
          dormitory.price_amount = dormitory.Price.price_amount;
          delete dormitory.Price;
        }
        return dormitory;
      });
    } catch (error) {
      console.error('Error querying dormitories:', error.message, error.stack);
      throw error;
    }
  }

  async findRoomsByDormitory(dormitoryId) {
    console.log(`Querying rooms for dormitory ID ${dormitoryId}`);
    try {
      // Assuming Room model exists and is associated
      const Room = require('../../domain/models/room');
      const rooms = await Room.findAll({
        where: { dormitory_id: dormitoryId }
      });
      return rooms.map(r => r.get({ plain: true }));
    } catch (error) {
      console.error('Error querying rooms:', error.message, error.stack);
      throw error;
    }
  }
  async findRoomById(room_id) {
    return await Room.findOne({ where: { room_id } });
  }
}

module.exports = DormitoryRepository;