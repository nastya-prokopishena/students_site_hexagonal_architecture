const { StudentOccupancy } = require('../../infrastructure/database/models');

class AssignRoom {
  constructor(studentService, dormitoryService) {
    this.studentService = studentService;
    this.dormitoryService = dormitoryService;
  }

  async execute(student_id, dormitory_id, room_id) {
    const lease_start_date = new Date();
    lease_start_date.setFullYear(new Date().getFullYear(), 8, 1); // 1 September
    const lease_term = 10; // 10 months
    const lease_end_date = new Date(lease_start_date);
    lease_end_date.setMonth(lease_end_date.getMonth() + lease_term);

    await StudentOccupancy.create({
      student_id,
      dormitory_id,
      room_id,
      lease_start_date,
      lease_term,
      lease_end_date,
      payment_id: 1, // Placeholder; update based on your pricing logic
    });
  }
}

module.exports = AssignRoom;