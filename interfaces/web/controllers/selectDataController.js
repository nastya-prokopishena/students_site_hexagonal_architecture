class SelectDataController {
  constructor(selectDataService) {
    this.selectDataService = selectDataService;
  }

  async getFaculties(req, res) {
    try {
      console.log('Controller: Getting faculties');
      const faculties = await this.selectDataService.getFaculties();
      console.log(`Controller: Returning ${faculties.length} faculties`);
      res.json(faculties);
    } catch (error) {
      console.error('Controller error in getFaculties:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSpecialties(req, res) {
    try {
      const facultyId = req.params.facultyId;
      console.log(`Controller: Getting specialties for faculty ID ${facultyId}`);
      
      // Fix: Call getSpecialtiesByFacultyId instead of getSpecialties
      const specialties = await this.selectDataService.getSpecialtiesByFacultyId(facultyId);
      
      console.log(`Controller: Returning ${specialties.length} specialties`);
      res.json(specialties);
    } catch (error) {
      console.error('Controller error in getSpecialties:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getBenefits(req, res) {
    try {
      console.log('Controller: Getting benefits');
      const benefits = await this.selectDataService.getBenefits();
      console.log(`Controller: Returning ${benefits.length} benefits`);
      res.json(benefits);
    } catch (error) {
      console.error('Controller error in getBenefits:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SelectDataController;