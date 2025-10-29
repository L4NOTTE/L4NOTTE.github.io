document.addEventListener('DOMContentLoaded', function () {
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

  // Обработчик для кнопки скачивания
  const downloadBtn = document.querySelector('.downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
      // Анимация при клике
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);

      // Можно добавить отслеживание кликов (опционально)
      console.log('Пользователь скачал каталог');
    });
  }

  // Функции для мобильных устройств
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  if (isMobileDevice()) {
    // Добавляет класс для мобильных
    document.body.classList.add('mobile-device');
  }

  // Предотвращает масштабирование при фокусе на инпутах в iOS
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      if (isMobileDevice()) {
        setTimeout(() => {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  });
});
