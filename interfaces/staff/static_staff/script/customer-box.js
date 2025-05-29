document.addEventListener('DOMContentLoaded', function () {
  const customerBox = document.getElementById('customer-box');
  const studentsButton = document.getElementById('students_button');
  const workersButton = document.getElementById('workers_button');

  if (customerBox) {
    customerBox.style.display = 'block';
  }

  if (studentsButton) {
    studentsButton.addEventListener('click', function () {
      window.location.href = '/';
    });
  }

  if (workersButton) {
    workersButton.addEventListener('click', function () {
      window.location.href = '/staff';
    });
  }
});