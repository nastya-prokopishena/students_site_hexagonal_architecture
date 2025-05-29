document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation link clicks
    const links = document.querySelectorAll('.navigation__element-link');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href && href.substring(1);
            const targetElement = targetId ? document.getElementById(targetId) : null;

            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target element with ID "${targetId}" not found`);
            }
        });
    });

    // Handle menu button click
    const button = document.querySelector('.menu__button');

    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href')?.substring(1);
            const targetElement = targetId ? document.getElementById(targetId) : null;

            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target element with ID "${targetId}" not found`);
            }
        });
    } else {
        console.warn('Menu button (.menu__button) not found');
    }
});