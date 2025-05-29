const SuperintendentService = require('../../../application/services/SuperintendentService');

class SuperintendentController {
  constructor(superintendentService, redisClient) {
    this.superintendentService = superintendentService || new SuperintendentService();
    this.redis = redisClient;
  }

  async getApplications(req, res) {
    try {
      const cacheKey = 'applications';
      let cachedApplications;
      if (this.redis) {
        try {
          cachedApplications = await this.redis.get(cacheKey);
        } catch (redisErr) {
          console.warn('Redis error, proceeding without cache:', redisErr);
        }
      }

      if (cachedApplications) {
        return res.json(JSON.parse(cachedApplications));
      }

      const applications = await this.superintendentService.getAllApplications();
      if (this.redis) {
        try {
          await this.redis.setEx(cacheKey, 3600, JSON.stringify(applications));
        } catch (redisErr) {
          console.warn('Failed to cache applications:', redisErr);
        }
      }
      res.json(applications);
    } catch (err) {
      console.error('Error retrieving applications:', err);
      res.status(500).json({ message: 'Помилка отримання заявок', details: err.message });
    }
  }

  async getResidents(req, res) {
    try {
      const cacheKey = 'residents';
      let cachedResidents;
      if (this.redis) {
        try {
          cachedResidents = await this.redis.get(cacheKey);
        } catch (redisErr) {
          console.warn('Redis error, proceeding without cache:', redisErr);
        }
      }

      if (cachedResidents) {
        return res.json(JSON.parse(cachedResidents));
      }

      const residents = await this.superintendentService.getResidentsWithAccommodation();
      if (this.redis) {
        try {
          await this.redis.setEx(cacheKey, 3600, JSON.stringify(residents));
        } catch (redisErr) {
          console.warn('Failed to cache residents:', redisErr);
        }
      }
      res.json(residents);
    } catch (err) {
      console.error('Error retrieving residents:', err);
      res.status(500).json({ message: 'Помилка отримання мешканців', details: err.message });
    }
  }

  async acceptApplication(req, res) {
    const { application_id, dormitory_id, room_id } = req.body;
    try {
      if (!application_id || !dormitory_id || !room_id) {
        return res.status(400).json({ message: 'Не всі дані були надіслані' });
      }
      await this.superintendentService.acceptApplication(application_id, dormitory_id, room_id);
      res.status(200).json({ message: 'Заявка успішно оброблена' });
    } catch (error) {
      console.error('Error processing application:', error);
      res.status(500).json({ message: 'Помилка обробки заявки', details: error.message });
    }
  }

  async rejectApplication(req, res) {
    const { application_id } = req.params;
    try {
      await this.superintendentService.rejectApplication(application_id);
      res.status(200).json({ message: 'Заявку успішно відхилено' });
    } catch (err) {
      console.error('Error rejecting application:', err);
      res.status(500).json({ message: 'Помилка відхилення заявки', details: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const superintendent = await this.superintendentService.authenticate(email, password);
      if (!superintendent) {
        return res.status(401).json({ error: 'Невірний email або пароль' });
      }
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      if (this.redis) {
        try {
          await this.redis.set(`auth:${token}`, email, { EX: 3600 });
        } catch (redisErr) {
          console.warn('Failed to store token in Redis:', redisErr);
        }
      }
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async searchStudents(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Параметр пошуку не надано' });
      }

      const students = await Student.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${query}%` } },
            { middle_name: { [Op.iLike]: `%${query}%` } },
            { last_name: { [Op.iLike]: `%${query}%` } },
          ],
        },
        attributes: ['first_name', 'middle_name', 'last_name', 'date_of_birth'],
        include: [
          {
            model: StudentOccupancy,
            as: 'Occupancies',
            attributes: [],
            required: false,
            include: [
              {
                model: Room,
                as: 'Room',
                attributes: ['room_number'],
                include: [
                  {
                    model: Dormitory,
                    as: 'Dormitory',
                    attributes: ['name'],
                  },
                ],
              },
            ],
          },
        ],
      });
      const result = students.map((student) => {
        const occupancy = student.Occupancies && student.Occupancies[0];
        const room = occupancy && occupancy.Room;
        const dormitory = room && room.Dormitory;
        return {
          first_name: student.first_name,
          middle_name: student.middle_name,
          last_name: student.last_name,
          date_of_birth: student.date_of_birth,
          dormitory_name: dormitory?.name || 'Не визначено',
          room_number: room?.room_number || 'Не визначено',
        };
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error searching students:', error);
      res.status(500).json({ message: 'Помилка пошуку студентів', details: error.message });
    }
  }
}

module.exports = SuperintendentController;