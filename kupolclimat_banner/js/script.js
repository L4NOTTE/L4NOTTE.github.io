document.addEventListener('DOMContentLoaded', function () {
    console.log('Сайт загружен!');
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navItems = document.querySelectorAll('.nav div');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Закрытие меню при клике на пункт
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Закрытие меню при ресайзе
        window.addEventListener('resize', function () {
            if (window.innerWidth > 850) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Модальное окно
    const modal = document.getElementById('applicationModal');
    const openButtons = document.querySelectorAll('.contact-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('applicationForm');

    if (!modal || !closeBtn || !form) {
        console.error('Не найдены элементы модального окна!');
        return;
    }

    // Создает контейнер для списка файлов
    const fileInput = document.getElementById('file');
    const fileList = document.createElement('div');
    fileList.className = 'file-list';
    if (fileInput && fileInput.parentNode) {
        fileInput.parentNode.appendChild(fileList);
    }

    let selectedFiles = [];

    // Открытие модального окна
    openButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Открытие модального окна');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', function () {
        console.log('Закрытие модального окна');
        closeModal();
    });

    // Закрытие при клике вне модального окна
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Обработка выбора файлов
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            console.log('Файлы выбраны');
            const files = Array.from(this.files);
            const maxSize = 5 * 1024 * 1024; // 5MB

            files.forEach(file => {
                if (file.size > maxSize) {
                    alert(`Файл "${file.name}" слишком большой. Максимальный размер: 5MB`);
                    return;
                }

                if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    selectedFiles.push(file);
                }
            });

            updateFileList();
            this.value = ''; // Очищает input
        });
    }

    // Обновление списка файлов
    function updateFileList() {
        if (!fileList) return;

        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const fileName = document.createElement('span');
            fileName.textContent = `${file.name} (${formatFileSize(file.size)})`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'file-remove';
            removeBtn.innerHTML = '×';
            removeBtn.title = 'Удалить файл';

            removeBtn.addEventListener('click', function () {
                selectedFiles.splice(index, 1);
                updateFileList();
            });

            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }

    // Форматирование размера файла
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Обработка отправки формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Отправка формы');

        const formData = new FormData(form);

        // Добавляет файлы в FormData
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        // Показывает индикатор загрузки
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Имитация отправки на сервер
        setTimeout(() => {
            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');

            // Восстанавливает кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Закрывает модальное окно и очищает форму
            closeModal();
            form.reset();
            selectedFiles = [];
            updateFileList();
        }, 1000);
    });

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                // Простое форматирование: +7 (XXX) XXX-XX-XX
                if (value.length <= 1) {
                    value = '+7 (' + value;
                } else if (value.length <= 4) {
                    value = '+7 (' + value.substring(1);
                } else if (value.length <= 7) {
                    value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
                } else if (value.length <= 9) {
                    value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
                } else {
                    value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
                }
            }

            e.target.value = value;
        });
    }

    console.log('Все скрипты инициализированы');
});