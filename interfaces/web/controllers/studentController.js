class StudentController {
  constructor(studentService) {
    this.studentService = studentService;
  }

  async getFaculties(req, res) {
    try {
      const faculties = await this.studentService.getFaculties();
      res.json(faculties);
    } catch (error) {
      console.error('Failed to get faculties:', error);
      res.status(500).json({ 
        error: 'Failed to get faculties',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getSpecialties(req, res) {
    try {
      const specialties = await this.studentService.getSpecialties(req.params.facultyId);
      res.json(specialties);
    } catch (error) {
      console.error('Failed to get specialties:', error);
      res.status(500).json({ 
        error: 'Failed to get specialties',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getBenefits(req, res) {
    try {
      const benefits = await this.studentService.getBenefits();
      res.json(benefits);
    } catch (error) {
      console.error('Failed to get benefits:', error);
      res.status(500).json({ 
        error: 'Failed to get benefits',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getDormitory(req, res) {
    try {
      const dormitory = await this.studentService.getDormitoryById(req.params.id);
      res.json(dormitory);
    } catch (error) {
      console.error('Failed to get dormitory:', error);
      res.status(500).json({ 
        error: 'Failed to get dormitory',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async submitApplication(req, res) {
    try {
      const result = await this.studentService.submitApplication(req.body);
      res.json(result);
    } catch (error) {
      console.error('Failed to submit application:', error);
      const statusCode = error.message.includes('Невірні') ? 400 : 500;
      res.status(statusCode).json({ 
        error: error.message || 'Failed to submit application',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = StudentController;