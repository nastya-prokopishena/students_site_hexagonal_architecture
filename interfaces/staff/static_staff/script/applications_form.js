document.addEventListener('DOMContentLoaded', () => {
  // Заповнення гуртожитків
  fetch('/api/dormitories')
    .then((response) => response.json())
    .then((data) => {
      const dormitorySelect = document.getElementById('dormitory');
      dormitorySelect.innerHTML = '<option value="" disabled selected>Виберіть гуртожиток</option>';
      data.forEach((dormitory) => {
        const option = document.createElement('option');
        option.value = dormitory.dormitory_id;
        option.text = dormitory.name;
        dormitorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error('Error fetching dormitories:', error));

  // Заповнення кімнат при виборі гуртожитку
  function fetchRoomsByDormitory(dormitoryId) {
    fetch(`/api/rooms/${dormitoryId}`)
      .then((response) => response.json())
      .then((data) => {
        const roomSelect = document.getElementById('room_number');
        roomSelect.innerHTML = '<option value="" disabled selected>Виберіть кімнату</option>';
        data.forEach((room) => {
          const option = document.createElement('option');
          option.value = room.room_id;
          option.text = room.room_number.toString();
          roomSelect.appendChild(option);
        });
      })
      .catch((error) => console.error('Error fetching rooms:', error));
  }

  document.getElementById('dormitory').addEventListener('change', function () {
    const selectedDormitoryId = this.value;
    if (selectedDormitoryId) {
      fetchRoomsByDormitory(selectedDormitoryId);
    }
  });

  // Обробка відправлення форми
  document.getElementById('accept_application_form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const application_id = document.getElementById('application_id').value;
    const dormitory_id = document.getElementById('dormitory').value;
    const room_id = document.getElementById('room_number').value;
    const lease_start_date = new Date();
    lease_start_date.setFullYear(new Date().getFullYear(), 8, 1); // 1 вересня поточного року
    const lease_term = 10; // 10 місяців
    const lease_end_date = new Date(lease_start_date);
    lease_end_date.setMonth(lease_end_date.getMonth() + lease_term);

    try {
      const response = await fetch('/api/accept_application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id,
          dormitory_id,
          room_id,
          lease_start_date,
          lease_term,
          lease_end_date,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert(data.message);
      document.getElementById('acceptModal').style.display = 'none';
      window.location.reload();
    } catch (error) {
      console.error('Error occurred:', error);
      alert('Помилка обробки заявки');
    }
  });
});