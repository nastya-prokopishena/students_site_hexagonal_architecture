document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/applications');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const applications = await response.json();
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
      console.error("Table body with ID 'tableBody' not found.");
      return;
    }
    tableBody.innerHTML = '';

    applications.forEach((application) => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = application.application_id;
      row.insertCell(1).textContent = application.first_name;
      row.insertCell(2).textContent = application.middle_name || '—';
      row.insertCell(3).textContent = application.last_name;
      row.insertCell(4).textContent = new Date(application.date_of_birth).toLocaleDateString();
      row.insertCell(5).textContent = application.phone_number;
      row.insertCell(6).textContent = application.email;
      row.insertCell(7).textContent = application.FacultyName || 'Невідомо';
      row.insertCell(8).textContent = application.SpecialtyName || 'Невідомо';
      row.insertCell(9).textContent = application.BenefitName || 'Невідомо';
      row.insertCell(10).textContent = application.home_city;
      row.insertCell(11).textContent = application.home_region;
      row.insertCell(12).textContent = application.home_address;
      row.insertCell(13).textContent = application.home_campus_number;
      row.insertCell(14).textContent = application.home_street_number;

      // Додавання кнопок "Прийняти" та "Відхилити"
      const actionsCell = row.insertCell(15);
      actionsCell.className = 'action-buttons';
      actionsCell.innerHTML = `
        <button class="accept-btn" data-application-id="${application.application_id}">Прийняти</button>
        <button class="reject-btn" data-application-id="${application.application_id}">Відхилити</button>
      `;
    });

    // Обробка кліків на кнопки "Прийняти"
    document.querySelectorAll('.accept-btn').forEach(button => {
      button.addEventListener('click', () => {
        const applicationId = button.getAttribute('data-application-id');
        const modal = document.getElementById('acceptModal');
        const applicationIdInput = document.getElementById('application_id');
        applicationIdInput.value = applicationId;
        modal.style.display = 'block';
      });
    });

    // Обробка кліків на кнопки "Відхилити"
    document.querySelectorAll('.reject-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const applicationId = button.getAttribute('data-application-id');
        if (confirm('Ви впевнені, що хочете відхилити цю заявку?')) {
          try {
            const response = await fetch(`/api/reject_application/${applicationId}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            alert('Заявку успішно відхилено');
            window.location.reload();
          } catch (error) {
            console.error('Error rejecting application:', error);
            alert('Помилка відхилення заявки');
          }
        }
      });
    });

    // Закриття модального вікна
    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('acceptModal').style.display = 'none';
    });

    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('acceptModal');
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Помилка отримання даних про заявки:', error);
  }
});