const SubmitApplication = require('../../../application/use-cases/SubmitApplication');

// Мокаємо ApplicationRepositoryPort
const mockApplicationRepository = {
  createApplication: jest.fn(),
};

describe('SubmitApplication Use Case', () => {
  let submitApplication;

  beforeEach(() => {
    // Ініціалізуємо use case перед кожним тестом
    submitApplication = new SubmitApplication(mockApplicationRepository);
    // Очищаємо моки
    jest.clearAllMocks();
  });

  test('should create an application with valid data', async () => {
    // Вхідні дані
    const applicationData = {
      faculty_id: 1,
      specialty_id: 2,
      benefit_id: 3,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    };

    // Мокаємо успішне створення заявки
    const createdApplication = { application_id: 1, ...applicationData };
    mockApplicationRepository.createApplication.mockResolvedValue(createdApplication);

    // Виконуємо use case
    const result = await submitApplication.execute(applicationData);

    // Перевіряємо результат
    expect(result).toEqual(createdApplication);
    expect(mockApplicationRepository.createApplication).toHaveBeenCalledWith(applicationData);
    expect(mockApplicationRepository.createApplication).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if required fields are missing', async () => {
    // Некоректні дані (відсутній faculty_id)
    const invalidApplicationData = {
      specialty_id: 2,
      benefit_id: 3,
      first_name: 'John',
      last_name: 'Doe',
    };

    // Перевіряємо, чи викидається помилка
    await expect(submitApplication.execute(invalidApplicationData)).rejects.toThrow(
      'Невірні або відсутні дані для створення заявки.'
    );
    expect(mockApplicationRepository.createApplication).not.toHaveBeenCalled();
  });

  test('should throw an error if repository fails', async () => {
    // Вхідні дані
    const applicationData = {
      faculty_id: 1,
      specialty_id: 2,
      benefit_id: 3,
      first_name: 'John',
      last_name: 'Doe',
    };

    // Мокаємо помилку в репозиторії
    mockApplicationRepository.createApplication.mockRejectedValue(new Error('Database error'));

    // Перевіряємо, чи помилка передається наверх
    await expect(submitApplication.execute(applicationData)).rejects.toThrow('Database error');
    expect(mockApplicationRepository.createApplication).toHaveBeenCalledWith(applicationData);
    expect(mockApplicationRepository.createApplication).toHaveBeenCalledTimes(1);
  });
});