document.addEventListener('DOMContentLoaded', () => {
  const residentsTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
  const searchForm = document.getElementById('filterStudents');
  const dormitoryFilter = document.getElementById('dormitory');

  async function fetchDormitories() {
    try {
      const response = await fetch('/api/dormitories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dormitories = await response.json();
      dormitories.forEach((dormitory) => {
        const option = document.createElement('option');
        option.value = dormitory.dormitory_id;
        option.textContent = dormitory.name;
        dormitoryFilter.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching dormitories:', error);
      alert(`Помилка завантаження гуртожитків: ${error.message}`);
    }
  }

  async function fetchResidents() {
    try {
      const response = await fetch('/api/residents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const residents = await response.json();
      residentsTable.innerHTML = '';
      residents.forEach((student) => {
        const row = residentsTable.insertRow();
        row.innerHTML = `
          <td>${student.last_name}</td>
          <td>${student.first_name}</td>
          <td>${student.middle_name || '—'}</td>
          <td>${new Date(student.date_of_birth).toLocaleDateString()}</td>
          <td>${student.dormitory_name || 'Не визначено'}</td>
          <td>${student.room_number || 'Не визначено'}</td>
        `;
      });
    } catch (error) {
      console.error('Error fetching residents:', error);
      alert(`Помилка завантаження мешканців: ${error.message}`);
    }
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const dormitory = dormitoryFilter.value;
    const room = document.getElementById('room').value;

    if (!lastName && !firstName && !middleName && !date_of_birth && !dormitory && !room) {
      alert('Введіть хоча б один критерій пошуку');
      return;
    }

    try {
      const params = new URLSearchParams();
      if (lastName) params.append('lastName', lastName);
      if (firstName) params.append('firstName', firstName);
      if (middleName) params.append('middleName', middleName);
      if (date_of_birth) params.append('date_of_birth', date_of_birth);
      if (dormitory && dormitory !== 'item.id') params.append('dormitory', dormitory);
      if (room && room !== 'item.id') params.append('room', room);

      const response = await fetch(`/api/search-students?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const students = await response.json();
      residentsTable.innerHTML = '';
      students.forEach((student) => {
        const row = residentsTable.insertRow();
        row.innerHTML = `
          <td>${student.last_name}</td>
          <td>${student.first_name}</td>
          <td>${student.middle_name || '—'}</td>
          <td>${new Date(student.date_of_birth).toLocaleDateString()}</td>
          <td>${student.dormitory_name || 'Не визначено'}</td>
          <td>${student.room_number || 'Не визначено'}</td>
        `;
      });
    } catch (error) {
      console.error('Error searching students:', error);
      alert(`Помилка пошуку студентів: ${error.message}`);
    }
  });

  fetchDormitories();
  fetchResidents();
});