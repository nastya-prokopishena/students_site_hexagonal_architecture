async function fetchSpecialtiesByFacultyId(facultyId) {
    try {
        console.log('Fetching specialties for faculty:', facultyId); // Додати лог
        const response = await fetch(`/api/specialties/${facultyId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch specialties: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Specialties received:', data); // Додати лог
        const specialtySelect = document.getElementById('specialty_name');

        if (specialtySelect) {
            specialtySelect.innerHTML = '<option value="" disabled selected>Спеціальність</option>';
            data.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.specialty_id;
                option.textContent = specialty.name;
                specialtySelect.appendChild(option);
            });
        } else {
            console.warn('Specialty select element (#specialty_name) not found');
        }
    } catch (error) {
        console.error('Error fetching specialties:', error.message);
    }
}

async function fetchDataAndPopulateSelect(url, selectId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const select = document.getElementById(selectId);

        if (select) {
            select.innerHTML = `<option value="" disabled selected>${selectId === 'faculty_name' ? 'Факультет' : 'Пільга'}</option>`;
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[`${selectId.split('_')[0]}_id`];
                    option.textContent = item.name;
                    select.appendChild(option);
                });
            } else {
                console.warn(`Data from ${url} is not an array:`, data);
            }
        } else {
            console.warn(`Select element (#${selectId}) not found`);
        }
    } catch (error) {
        console.error(`Error fetching data for ${selectId}:`, error.message);
    }
}

fetchDataAndPopulateSelect('/api/fetch-select-data/faculties', 'faculty_name');
fetchDataAndPopulateSelect('/api/benefits', 'benefit_name');

const facultySelect = document.getElementById('faculty_name');
if (facultySelect) {
    facultySelect.addEventListener('change', (event) => {
        const selectedFacultyId = parseInt(event.target.value, 10);
        if (selectedFacultyId) {
            fetchSpecialtiesByFacultyId(selectedFacultyId);
        } else {
            const specialtySelect = document.getElementById('specialty_name');
            if (specialtySelect) {
                specialtySelect.innerHTML = '<option value="" disabled selected>Спеціальність</option>';
            }
        }
    });
} else {
    console.warn('Faculty select element (#faculty_name) not found');
}