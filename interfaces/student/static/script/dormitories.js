/**
 * Функція для отримання всіх гуртожитків з API
 * @returns {Promise<Array>} Масив гуртожитків
 */
async function fetchAllDormitories() {
    try {
        const response = await fetch('/api/dormitories?includePrices=true');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all dormitories:', error);
        return [];
    }
}

/**
 * Ініціалізація відображення гуртожитків
 */
async function initializeDormitories() {
    try {
        // Приховати всі описи гуртожитків при старті
        document.querySelectorAll('.dormitories__content-describtion').forEach(desc => {
            desc.style.display = 'none';
        });

        // Отримуємо дані гуртожитків
        const dormitories = await fetchAllDormitories();
        console.log('All dormitories:', dormitories);

        if (dormitories.length === 0) {
            showErrorMessage('Не вдалося завантажити інформацію про гуртожитки');
            return;
        }

        // Оновлюємо інформацію для кожного гуртожитка
        dormitories.forEach(dormitory => {
            const dormitoryId = dormitory.dormitory_id;
            const element = document.getElementById(`dormitory_${dormitoryId}`);
            
            if (element) {
                // Основна інформація
                element.querySelector('.content-describtion__title').textContent = dormitory.name || `Гуртожиток ${dormitoryId}`;
                element.querySelector('.address').textContent = dormitory.address || 'Адреса не вказана';
                element.querySelector('.phone').textContent = dormitory.phone_number || 'Не вказано';
                element.querySelector('.residents').textContent = dormitory.type_residents || 'Не вказано';
                
                // Вартість проживання
                const priceElement = element.querySelector('.price');
                const priceAmount = dormitory.price_amount;
                
                if (priceAmount) {
                    priceElement.textContent = `${priceAmount} грн/міс`;
                    priceElement.style.fontWeight = 'bold';
                } else {
                    priceElement.textContent = 'Уточнюйте';
                    priceElement.style.color = '#888';
                }
            } else {
                console.warn(`Елемент для гуртожитку з ID ${dormitoryId} не знайдено`);
            }

            // Оновлюємо заголовок тригера
            const triggerElement = document.getElementById(`dormitory_${dormitoryId}_trigger`);
            if (triggerElement) {
                triggerElement.querySelector('.content__box-title').textContent = dormitory.name || `Гуртожиток ${dormitoryId}`;
            } else {
                console.warn(`Тригер для гуртожитку з ID ${dormitoryId}_trigger не знайдено`);
            }
        });
    } catch (error) {
        console.error('Failed to initialize dormitories:', error);
        showErrorMessage('Не вдалося завантажити інформацію про гуртожитки');
    }
}

/**
 * Відображення повідомлення про помилку
 * @param {string} message Текст повідомлення
 */
function showErrorMessage(message) {
    const container = document.querySelector('.dormitories__content');
    if (container) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.padding = '20px';
        errorElement.style.textAlign = 'center';
        
        container.appendChild(errorElement);
    }
}

/**
 * Налаштування інтерактивності гуртожитків
 */
function setupDormitoryInteractions() {
    // Обробка кліків на блоки гуртожитків
    const contentBoxes = document.querySelectorAll(".content__box");
    contentBoxes.forEach(box => {
        box.addEventListener("click", () => {
            // Отримуємо номер гуртожитку з ID
            const triggerId = box.id;
            const dormitoryNumber = triggerId.replace('dormitory_', '').replace('_trigger', '');
            const dormitoryId = `dormitory_${dormitoryNumber}`;
            const dormitoryContent = document.getElementById(dormitoryId);
            
            if (dormitoryContent) {
                // Закриваємо всі інші відкриті описи
                document.querySelectorAll('.dormitories__content-describtion').forEach(desc => {
                    if (desc.id !== dormitoryId && desc.style.display === 'block') {
                        desc.style.display = 'none';
                    }
                });
                
                // Перемикаємо відображення поточного
                const isHidden = dormitoryContent.style.display === "none" || !dormitoryContent.style.display;
                dormitoryContent.style.display = isHidden ? "block" : "none";
                
                // Прокручуємо до опису, якщо він відкритий
                if (isHidden) {
                    setTimeout(() => {
                        dormitoryContent.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 100);
                }
            } else {
                console.warn(`Елемент з ID ${dormitoryId} не знайдено`);
            }
        });
    });

    // Обробка кліків на кнопки закриття
    const closers = document.querySelectorAll(".content-describtion__box-closer");
    closers.forEach(closer => {
        closer.addEventListener("click", (event) => {
            event.stopPropagation();
            const dormitoryNumber = closer.id.replace("closer_", "");
            const dormitoryContentToClose = document.getElementById(`dormitory_${dormitoryNumber}`);
            if (dormitoryContentToClose) {
                dormitoryContentToClose.style.display = "none";
            } else {
                console.warn(`Елемент з ID dormitory_${dormitoryNumber} не знайдено`);
            }
        });
    });
}

// Запуск при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
    // Виправляємо ID тригерів, якщо вони не відповідають очікуваному формату
    const contentBoxes = document.querySelectorAll(".content__box");
    contentBoxes.forEach((box, index) => {
        const dormitoryNumber = index + 1;
        box.id = `dormitory_${dormitoryNumber}_trigger`;
    });
    
    initializeDormitories().then(() => {
        setupDormitoryInteractions();
        console.log('Dormitories page initialized successfully');
    }).catch(error => {
        console.error('Failed to initialize dormitories page:', error);
    });
});