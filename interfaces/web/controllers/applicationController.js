const ApplicationRepository = require('../../../infrastructure/repositories/ApplicationRepository');
const ApplicationService = require('../../../application/services/ApplicationService');
const { Faculty, Specialty, Benefit, Student, StudentOccupancy, Room, Application } = require('../../../infrastructure/database/models');

const applicationRepository = new ApplicationRepository();
const applicationService = new ApplicationService(applicationRepository);

exports.submitApplication = async (req, res) => {
  try {
    console.log('Received application data:', req.body);
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_name,
      specialty_name,
      benefit_name,
      year_of_study,
    } = req.body;

    const facultyId = parseInt(faculty_name, 10);
    const specialtyId = parseInt(specialty_name, 10);
    const benefitId = parseInt(benefit_name, 10);

    if (isNaN(facultyId) || isNaN(specialtyId) || isNaN(benefitId)) {
      console.log('Invalid ID values:', { facultyId, specialtyId, benefitId });
      return res.status(400).json({ error: 'Невірні або відсутні ID для факультету, спеціальності або пільги.' });
    }

    const faculty = await Faculty.findOne({ where: { faculty_id: facultyId } });
    const specialty = await Specialty.findOne({ where: { specialty_id: specialtyId } });
    const benefit = await Benefit.findOne({ where: { benefit_id: benefitId } });

    if (!faculty || !specialty || !benefit) {
      console.log('Invalid data:', { faculty, specialty, benefit });
      return res.status(400).json({ error: 'Невірні або відсутні дані для створення заявки.' });
    }

    const applicationData = {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_id: faculty.faculty_id,
      specialty_id: specialty.specialty_id,
      benefit_id: benefit.benefit_id,
      year_of_study,
    };

    await applicationService.submit(applicationData);
    res.status(200).json({ message: 'Заявка успішно подана' });
  } catch (error) {
    console.error('Error in submitApplication:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await applicationService.getAllApplications();
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Помилка отримання заявок' });
  }
};

exports.acceptApplication = async (req, res) => {
  try {
    const { application_id, dormitory_id, room_id, lease_start_date, lease_term, lease_end_date } = req.body;

    if (!application_id || !dormitory_id || !room_id) {
      return res.status(400).json({ message: 'Не всі дані були надіслані' });
    }

    const application = await Application.findOne({ where: { application_id } });
    if (!application) {
      return res.status(404).json({ message: 'Заявка не знайдена' });
    }

    const room = await Room.findOne({ where: { room_id, dormitory_id } });
    if (!room) {
      return res.status(404).json({ message: 'Кімната не знайдена' });
    }

    // Check room capacity (assuming a default capacity of 4; adjust based on your room types)
    const currentOccupants = await StudentOccupancy.count({ where: { room_id } });
    const roomCapacity = 4; // Adjust based on your room type or add to Room model
    if (currentOccupants >= roomCapacity) {
      return res.status(400).json({ message: 'Кімната заповнена' });
    }

    // Create student
    const student = await Student.create({
      first_name: application.first_name,
      middle_name: application.middle_name,
      last_name: application.last_name,
      date_of_birth: application.date_of_birth,
      home_address: application.home_address,
      phone_number: application.phone_number,
      email: application.email,
      home_city: application.home_city,
      home_region: application.home_region,
      home_campus_number: application.home_campus_number,
      home_street_number: application.home_street_number,
    });

    // Create occupancy record
    await StudentOccupancy.create(
      {
        student_id: student.student_id,
        dormitory_id,
        room_id,
        lease_start_date,
        lease_term,
        lease_end_date,
        benefit_id: application.benefit_id,
      },
      {
        returning: [
          'occupancy_id',
          'student_id',
          'dormitory_id',
          'room_id',
          'lease_start_date',
          'lease_term',
          'lease_end_date',
          'benefit_id',
        ],
      }
    );

    // Delete application
    await applicationService.deleteApplication(application_id);

    res.status(200).json({ message: 'Заявка успішно оброблена' });
  } catch (error) {
    console.error('Error accepting application:', error);
    res.status(500).json({ message: 'Помилка обробки заявки', details: error.message });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const { application_id } = req.params;
    const application = await Application.findOne({ where: { application_id } });
    if (!application) {
      return res.status(404).json({ message: 'Заявка не знайдена' });
    }

    await applicationService.deleteApplication(application_id);
    res.status(200).json({ message: 'Заявку успішно відхилено' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Помилка відхилення заявки', details: error.message });
  }
};

module.exports = exports;