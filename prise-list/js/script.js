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

// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Элементы модального окна
  const modal = document.getElementById('applicationModal');
  const openButtons = document.querySelectorAll('.bid, .about-left .bid');
  const closeBtn = document.querySelector('.close');
  const form = document.getElementById('applicationForm');

  // Открытие модального окна
  openButtons.forEach(button => {
    button.addEventListener('click', function() {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    });
  });

  // Закрытие модального окна
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Закрытие при клике вне модального окна
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Обработка отправки формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Здесь можно добавить отправку данных на сервер
    const formData = new FormData(form);
    
    // Временное сообщение об успехе
    alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
    
    // Закрывает модальное окно
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    form.reset();
  });

  // Валидация файлов
  const fileInput = document.getElementById('file');
  fileInput.addEventListener('change', function() {
    const files = this.files;
    const maxSize = 5 * 1024 * 1024; // 5MB в байтах
    
    for (let file of files) {
      if (file.size > maxSize) {
        alert(`Файл "${file.name}" слишком большой. Максимальный размер: 5MB`);
        this.value = ''; // Очищаем input
        break;
      }
    }
  });

  // Функционал поиска (оставляем ваш существующий код)
  const searchIcon = document.querySelector('.search');
  // ... остальной код поиска ...
});
