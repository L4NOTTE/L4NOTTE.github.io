class BannerRotator {
    constructor(containerId, rotationInterval = 7000) {
        this.container = document.getElementById(containerId);
        this.currentBanner = 0;
        this.rotationInterval = rotationInterval;
        this.intervalId = null;
        
        // Проверяем, существует ли контейнер
        if (!this.container) {
            console.error('Контейнер баннеров не найден:', containerId);
            return;
        }
        
        this.banners = [
            this.createBanner1(),
            this.createBanner2()
        ];
        
        this.init();
    }
    
    init() {
        console.log('Инициализация баннеров в контейнере:', this.container);
        
        if (!this.container) return;
        
        this.showBanner(0);
        this.startRotation();
        
        // Обработчики для кнопок
        this.container.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.textContent === 'СМОТРЕТЬ') {
                this.handleBannerClick();
            }
        });
    }
    
    createBanner1() {
        return `
            <div class="rotating-banner banner-1">
                <img src="img/Климат_белый.png" alt="Распродажа" onerror="console.error('Ошибка загрузки изображения 1')">
                <div class="banner-text">
                    РАСПРОДАЖА<br>
                    СКЛАДСКИХ ОСТАТКОВ<br>
                </div>
                <button class="banner-btn">СМОТРЕТЬ</button>
                <div class="banner-indicator">
                    <span class="indicator-dot active" data-index="0"></span>
                    <span class="indicator-dot" data-index="1"></span>
                </div>
            </div>
        `;
    }
    
    createBanner2() {
        return `
            <div class="rotating-banner banner-2">
                <span class="banner-images">
                    <img src="img/1.png" alt="Продукция 1" onerror="console.error('Ошибка загрузки изображения 2-1')">
                    <img src="img/2.png" alt="Продукция 2" onerror="console.error('Ошибка загрузки изображения 2-2')">
                    <img src="img/3.png" alt="Продукция 3" onerror="console.error('Ошибка загрузки изображения 2-3')">
                    <img src="img/4.png" alt="Продукция 4" onerror="console.error('Ошибка загрузки изображения 2-4')">
                </span>
                <div class="banner-text">
                    <h1>КАТАЛОГ</h1>
                    <p>гражданской продукции</p>
                </div>
                <button class="banner-btn">СМОТРЕТЬ</button>
                <div class="banner-indicator">
                    <span class="indicator-dot" data-index="0"></span>
                    <span class="indicator-dot active" data-index="1"></span>
                </div>
            </div>
        `;
    }
    
    showBanner(index) {
        if (!this.container) return;
        
        this.currentBanner = index;
        
        // Анимация исчезновения
        const currentActive = this.container.querySelector('.rotating-banner.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        
        // Устанавливаем таймаут для плавной смены
        setTimeout(() => {
            this.container.innerHTML = this.banners[index];
            const newBanner = this.container.querySelector('.rotating-banner');
            if (newBanner) {
                setTimeout(() => newBanner.classList.add('active'), 50);
            }
            
            this.updateIndicators();
        }, 500);
    }
    
    updateIndicators() {
        const indicators = this.container.querySelectorAll('.indicator-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentBanner);
            
            // Добавляем обработчики клика на индикаторы
            dot.addEventListener('click', () => {
                this.showBanner(index);
                this.restartRotation();
            });
        });
    }
    
    nextBanner() {
        const nextIndex = (this.currentBanner + 1) % this.banners.length;
        this.showBanner(nextIndex);
    }
    
    startRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.nextBanner();
        }, this.rotationInterval);
    }
    
    stopRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    restartRotation() {
        this.stopRotation();
        this.startRotation();
    }
    
    handleBannerClick() {
        // Можно добавить логику при клике на кнопку "СМОТРЕТЬ"
        if (this.currentBanner === 0) {
            window.location.href = '/sale';
        } else {
            window.location.href = '/catalog';
        }
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация баннеров...');
    
    const bannerContainer = document.getElementById('banner-container');
    if (bannerContainer) {
        console.log('Контейнер баннеров найден');
        const bannerRotator = new BannerRotator('banner-container', 7000);
        
        // Пауза при наведении мыши
        bannerContainer.addEventListener('mouseenter', () => {
            if (bannerRotator) bannerRotator.stopRotation();
        });
        
        bannerContainer.addEventListener('mouseleave', () => {
            if (bannerRotator) bannerRotator.restartRotation();
        });
    } else {
        console.error('Контейнер баннеров НЕ НАЙДЕН!');
    }

    // Временный код для проверки
    console.log('Banner container:', document.getElementById('banner-container'));
    console.log('All banners:', document.querySelectorAll('.rotating-banner'));
});

