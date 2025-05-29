document.querySelector('.accommodation__form-content').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/applications/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Заявка успішно подана');
    } else {
      throw new Error(result.error || 'Помилка при відправці заявки');
    }
  } catch (error) {
    console.error('Error submitting application:', error.message);
    alert('Помилка: ' + error.message);
  }
});