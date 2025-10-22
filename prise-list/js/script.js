document.addEventListener('DOMContentLoaded', function () {
    // Функционал поиска
    const searchIcon = document.querySelector('.search');
    const searchContainer = document.querySelector('.search');

    // Создает поле ввода для поиска
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск...';
    searchInput.className = 'search-input';

    // Создает контейнер для поиска
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-container';
    searchWrapper.appendChild(searchInput);

    // Заменяет иконку поиска на контейнер с полем ввода
    searchContainer.parentNode.replaceChild(searchWrapper, searchContainer);
    searchWrapper.appendChild(searchContainer);

    // Обработчик клика по иконке поиска
    searchContainer.addEventListener('click', function (e) {
        e.stopPropagation();
        searchInput.classList.toggle('active');

        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Закрывает поиск при клике вне его
    document.addEventListener('click', function (e) {
        if (!searchWrapper.contains(e.target)) {
            searchInput.classList.remove('active');
        }
    });

    // Обработчик ввода в поиск
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Поиск:', searchTerm);
        // Здесь можно добавить логику поиска по странице
    });

    // Обработчик нажатия Enter в поиске
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            alert('Выполняется поиск: ' + this.value);
            // Здесь можно добавить логику выполнения поиска
        }
    });

    // Анимация элементов при скролле
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.product-grid');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    // Запускает анимацию при загрузке и скролле
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    document.querySelector('.downloadBtn').addEventListener('click', function(e) {
  // Анимация при клике
  this.style.transform = "scale(0.95)";
  setTimeout(() => {
    this.style.transform = "scale(1)";
  }, 150);
  
  // Можно добавить отслеживание кликов (опционально)
  console.log('Пользователь скачал каталог');
});
   
});

