document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    menuToggle.addEventListener('click', function () {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Блокировка скролла при открытом меню
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Закрытие меню при ресайзе окна
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
// Выпадающие списки в сайдбаре
const sidebarToggles = document.querySelectorAll('.sidebar-toggle');

sidebarToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const sub = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // Закрывает все открытые списки
        document.querySelectorAll('.sub.active').forEach(activeSub => {
            if (activeSub !== sub) {
                activeSub.classList.remove('active');
                activeSub.previousElementSibling.classList.remove('active');
            }
        });

        // Переключает текущий список
        this.classList.toggle('active');
        sub.classList.toggle('active');
    });

});
