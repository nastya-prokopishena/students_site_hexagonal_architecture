# students_site_hexagonal_architecture

# Система управління студентськими гуртожитками

Цей проєкт є системою управління студентськими гуртожитками, побудованою з використанням **Hexagonal Architecture**. Система складається з backend (Node.js, Express, Sequelize) та frontend (HTML, CSS, JavaScript).

---

## ⚙️ Вимоги

Для запуску проєкту необхідні:

- Node.js (версія 18.x або вище)
- PostgreSQL (версія 12 або вище)
- Redis
- npm (встановлюється разом з Node.js)

---

## 📥 Встановлення

### 1. Клонування репозиторію:

```bash
git clone https://github.com/nastya-prokopishena/students_site_hexagonal_architecture.git
cd students-dormitory-system
````

### 2. Встановлення залежностей:

```bash
npm install
```

### 3. Налаштування бази даних:

* Створіть базу даних у PostgreSQL.
* Налаштуйте параметри підключення у файлі:

  ```
  infrastructure/database/sequelize.js
  ```

### 4. Налаштування Redis:

* Переконайтесь, що Redis встановлений та запущений.
* Вкажіть параметри підключення у файлі:

  ```
  infrastructure/database/redis.js
  ```

### 5. Налаштування конфігурації:

* Відредагуйте файл `config.js` для задання необхідних параметрів (порт, email тощо).

---

## 🚀 Запуск проєкту

### Стандартний запуск сервера:

```bash
node start
```

Сервер запуститься на порту **5500**: [http://localhost:5500](http://localhost:5500)

#### При запуску:

* Виконується підключення до PostgreSQL.
* Sequelize автоматично синхронізує моделі.
* У разі помилки підключення програма завершить роботу.


---

## 🧪 Тестування

Проєкт використовує **Jest**. Для запуску тестів:

```bash
npm test -- --coverage 
```

* Усі тести розташовані в папці `test/`
* Покриття коду тестами зберігається в `coverage/`

Для перегляду звіту про покриття:

```bash
coverage/lcov-report/index.html
```

---

## 📏 Лінтинг та аналіз коду

### ESLint

```bash
npm run lint          
npm run lint:fix      
```

> Звіт зберігається у `eslint-report.txt`

### Plato (статичний аналіз)

```bash
npm install -g git+https://github.com/es-analysis/plato.git

plato -r -d report -t "Project Analysis" ./application ./infrastructure ./web ./domain
```

> Звіт буде доступний у `report/index.html`

---

## 🗂️ Структура проєкту

```plaintext
application/     - Бізнес-логіка (сервіси, use-cases)
domain/          - Сутності та інтерфейси (порти)
infrastructure/  - Робота з базою, Redis, email
interfaces/      - Frontend (HTML/CSS/JS), веб-контролери
test/            - Юніт-тести
coverage/        - Покриття тестами
```

---

## 🚦 Тестування продуктивності з Autocannon

Для перевірки продуктивності можна використати **Autocannon**:

### Встановлення:

```bash
npm install -g autocannon
```

### Приклад запуску тесту на головний маршрут(сторінка для студентів):

```bash
autocannon -c 100 -d 10 http://127.0.0.1:5500      
```

### Приклад запуску тесту на головний маршрут(сторінка для працівників):

```bash
autocannon -c 100 -d 10 http://127.0.0.1:5500/staff     

```

* `-c` — кількість одночасних з'єднань (clients)
* `-d` — тривалість тесту в секундах (duration)
* `-p` — кількість запитів у пайплайні

> Autocannon відобразить звіт із даними про RPS, затримки, кількість запитів/відповідей та ін.

---

## 🌐 Доступ до системи

* Інтерфейс для студентів: [http://localhost:5500/](http://localhost:5500/)
* Інтерфейс для персоналу: [http://localhost:5500/staff](http://localhost:5500/staff)

---

## 📌 Додаткові примітки

* Перед запуском переконайтесь, що **PostgreSQL** та **Redis** працюють.
* SCSS-файл знаходиться у `interfaces/src/style.scss` та компілюється у `style.css`.

