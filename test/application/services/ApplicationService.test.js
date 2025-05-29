const ApplicationService = require('../../../application/services/ApplicationService');
const SubmitApplication = require('../../../application/use-cases/SubmitApplication');

// Мокаємо SubmitApplication і ApplicationRepository
const mockSubmitApplication = {
  execute: jest.fn(),
};

const mockApplicationRepository = {
  createApplication: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
};

// Мокаємо конструктор SubmitApplication
jest.mock('../../../application/use-cases/SubmitApplication', () => {
  return jest.fn().mockImplementation(() => {
    return mockSubmitApplication;
  });
});

describe('ApplicationService', () => {
  let applicationService;

  beforeEach(() => {
    // Ініціалізуємо сервіс перед кожним тестом
    applicationService = new ApplicationService(mockApplicationRepository);
    // Очищаємо моки
    jest.clearAllMocks();
  });

  describe('submit', () => {
    test('should call SubmitApplication.execute with correct data and return result', async () => {
      // Вхідні дані
      const applicationData = {
        faculty_id: 1,
        specialty_id: 2,
        benefit_id: 3,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      };

      // Мокаємо успішне виконання
      const createdApplication = { application_id: 1, ...applicationData };
      mockSubmitApplication.execute.mockResolvedValue(createdApplication);

      // Виконуємо метод
      const result = await applicationService.submit(applicationData);

      // Перевіряємо результат
      expect(result).toEqual(createdApplication);
      expect(mockSubmitApplication.execute).toHaveBeenCalledWith(applicationData);
      expect(mockSubmitApplication.execute).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if SubmitApplication.execute fails', async () => {
      // Вхідні дані
      const applicationData = {
        faculty_id: 1,
        specialty_id: 2,
        benefit_id: 3,
      };

      // Мокаємо помилку
      mockSubmitApplication.execute.mockRejectedValue(new Error('Invalid data'));

      // Перевіряємо обробку помилки
      await expect(applicationService.submit(applicationData)).rejects.toThrow('Invalid data');
      expect(mockSubmitApplication.execute).toHaveBeenCalledWith(applicationData);
      expect(mockSubmitApplication.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllApplications', () => {
    test('should return all applications with associated data', async () => {
      // Мокаємо результат findAll
      const applications = [
        {
          application_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          Benefit: { name: 'Scholarship' },
          Faculty: { name: 'Engineering' },
          Specialty: { name: 'Computer Science' },
          BenefitName: 'Scholarship',
          FacultyName: 'Engineering',
          SpecialtyName: 'Computer Science',
        },
      ];
      mockApplicationRepository.findAll.mockResolvedValue(applications);

      // Виконуємо метод
      const result = await applicationService.getAllApplications();

      // Перевіряємо результат
      expect(result).toEqual(applications);
      expect(mockApplicationRepository.findAll).toHaveBeenCalledWith({
        include: [
          { model: expect.anything(), attributes: ['name'], as: 'Benefit' },
          { model: expect.anything(), attributes: ['name'], as: 'Faculty' },
          { model: expect.anything(), attributes: ['name'], as: 'Specialty' },
        ],
        attributes: [
          'application_id',
          'first_name',
          'middle_name',
          'last_name',
          'date_of_birth',
          'home_address',
          'home_street_number',
          'home_campus_number',
          'home_city',
          'home_region',
          'phone_number',
          'email',
          [expect.anything(), 'BenefitName'],
          [expect.anything(), 'FacultyName'],
          [expect.anything(), 'SpecialtyName'],
        ],
      });
      expect(mockApplicationRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if findAll fails', async () => {
      // Мокаємо помилку
      mockApplicationRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Перевіряємо обробку помилки
      await expect(applicationService.getAllApplications()).rejects.toThrow('Database error');
      expect(mockApplicationRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getApplicationById', () => {
    test('should return application by ID', async () => {
      // Мокаємо результат findById
      const application = {
        application_id: 1,
        first_name: 'John',
        last_name: 'Doe',
      };
      mockApplicationRepository.findById.mockResolvedValue(application);

      // Виконуємо метод
      const result = await applicationService.getApplicationById(1);

      // Перевіряємо результат
      expect(result).toEqual(application);
      expect(mockApplicationRepository.findById).toHaveBeenCalledWith(1);
      expect(mockApplicationRepository.findById).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if findById fails', async () => {
      // Мокаємо помилку
      mockApplicationRepository.findById.mockRejectedValue(new Error('Not found'));

      // Перевіряємо обробку помилки
      await expect(applicationService.getApplicationById(1)).rejects.toThrow('Not found');
      expect(mockApplicationRepository.findById).toHaveBeenCalledWith(1);
      expect(mockApplicationRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteApplication', () => {
    test('should delete application by ID', async () => {
      // Мокаємо успішне видалення
      mockApplicationRepository.delete.mockResolvedValue(1);

      // Виконуємо метод
      const result = await applicationService.deleteApplication(1);

      // Перевіряємо результат
      expect(result).toEqual(1);
      expect(mockApplicationRepository.delete).toHaveBeenCalledWith(1);
      expect(mockApplicationRepository.delete).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if delete fails', async () => {
      // Мокаємо помилку
      mockApplicationRepository.delete.mockRejectedValue(new Error('Delete failed'));

      // Перевіряємо обробку помилки
      await expect(applicationService.deleteApplication(1)).rejects.toThrow('Delete failed');
      expect(mockApplicationRepository.delete).toHaveBeenCalledWith(1);
      expect(mockApplicationRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});