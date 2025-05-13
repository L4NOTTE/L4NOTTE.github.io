document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
});

function generateDemoResponse() {
  const userText = document.getElementById('userInput').value.toLowerCase();
  const responseBox = document.getElementById('demoResponse');
  
  const demoAnswers = {
    "привет": "Здравствуйте! Чем могу помочь?",
    "пока": "До свидания! Удачи в обучении!",
    "что такое экспертная система": "Это программа, имитирующая мышление эксперта и дающая рекомендации или заключения на основе базы знаний и логики.",
    "зачем нужны экспертные системы": "Они помогают принимать решения в сложных ситуациях, где нужен опытный специалист.",
    "какие компоненты экспертной системы": "База знаний, механизм вывода, интерфейс пользователя и модуль объяснения.",
    "что такое база знаний": "Это структурированная информация, содержащая факты и правила для принятия решений.",
    "что такое механизм вывода": "Это интеллектуальное ядро системы. Оно анализирует факты и применяет правила для получения нового вывода.",
    "какие бывают виды вывода": "Прямой (от фактов к выводу) и обратный (от цели к подтверждению).",
    "как представляются знания в экспертной системе": "Через правила, фреймы, семантические сети и онтологии.",
    "что такое правила": "Это конструкции вида 'если ... то ...', которые формализуют знания эксперта.",
    "примеры экспертных систем": "IBM Watson, DENDRAL, DeepMind, PathFinder, CLIPS, S.W.A.T.",
    "этапы разработки экспертной системы": "Анализ, сбор знаний, формализация, проектирование, реализация, тестирование и внедрение.",
    "как работает экспертная система": "Пользователь вводит данные, механизм вывода применяет правила, и система выдаёт ответ на основе базы знаний.",
    "ты экспертная система": "Я простая демонстрационная модель, но стараюсь помогать как могу!",

    "что такое эис": "Экспертная информационная система (ЭИС) - это программный комплекс для принятия решений в конкретной предметной области.",
    "расскажи о компонентах эис": "Основные компоненты включают: базу знаний, механизм логического вывода, интерфейс пользователя и систему объяснений.",
    "перечисли этапы создания": "Этапы разработки: 1) Анализ 2) Сбор знаний 3) Формализация 4) Проектирование 5) Реализация 6) Тестирование 7) Внедрение",

    "default": `Демо-режим. Попробуйте вопросы:
    - Что такое экспертная система?
    - Как работает ЭИС?
    - Примеры экспертных систем
    - Этапы разработки
    - Виды вывода`
  };

  let answer = demoAnswers[userText];
  
  if (!answer) {
    const foundKey = Object.keys(demoAnswers).find(key => 
      userText.includes(key) && key !== "default"
    );
    answer = foundKey ? demoAnswers[foundKey] : demoAnswers.default;
  }

  responseBox.innerHTML = answer.replace(/\n/g, '<br>');
  responseBox.classList.add('visible');

  responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}