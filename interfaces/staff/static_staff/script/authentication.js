document.querySelector('.menu__button').addEventListener('click', () => {
  const email = prompt('Введіть email:');
  const password = prompt('Введіть пароль:');
  if (email && password) {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Авторизація успішна');
          sessionStorage.setItem('superintendent_id', data.superintendent_id);
          window.location.href = '/staff/index.html';
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Помилка:', error);
        alert('Помилка авторизації');
      });
  }
});