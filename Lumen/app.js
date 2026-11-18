
const stages = {
  source: ['Структура и стили', 'Движок разбирает HTML в дерево элементов и вычисляет CSS-стили для каждого элемента.'],
  layout: ['Размеры и положение', 'Движок вычисляет, где расположить текст, изображения и блоки с учётом размеров окна.'],
  paint: ['Готовый кадр', 'Движок рисует текст, фон и другие элементы, затем собирает слои в кадр для экрана.']
};

const canvas = document.querySelector('.demo-art');
const buttons = [...document.querySelectorAll('[data-stage]:is(button)')];
const title = document.querySelector('#step-title');
const copy = document.querySelector('#step-copy');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const stage = button.dataset.stage;
    canvas.dataset.stage = stage;
    [title.textContent, copy.textContent] = stages[stage];

    for (const item of buttons) {
      item.setAttribute('aria-pressed', String(item === button));
    }
  });
}

const sky = document.querySelector('.sky');
const motionToggle = document.querySelector('.sky-toggle');

motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
  const paused = sky.toggleAttribute('data-paused');
  motionToggle.setAttribute('aria-pressed', String(!paused));
});

const scene = document.querySelector('.hero');
const visual = document.querySelector('.visual');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

let frame = 0;
let tiltX = 0;
let tiltY = 0;

function renderScene() {
  frame = 0;

  if (reduced.matches || sky.hasAttribute('data-paused')) {
    visual.style.removeProperty('--stage-y');
    visual.style.removeProperty('--stage-rx');
    visual.style.removeProperty('--stage-ry');
    return;
  }

  const progress = Math.min(
    1,
    Math.max(
      0,
      -scene.getBoundingClientRect().top / scene.offsetHeight
    )
  );

  visual.style.setProperty(
    '--stage-y',
    (progress * 86).toFixed(1) + 'px'
  );

  visual.style.setProperty(
    '--stage-rx',
    (tiltX + progress * 17).toFixed(1) + 'deg'
  );

  visual.style.setProperty(
    '--stage-ry',
    (tiltY + progress * 9).toFixed(1) + 'deg'
  );
}

function scheduleScene() {
  if (!frame) {
    frame = requestAnimationFrame(renderScene);
  }
}

addEventListener('scroll', scheduleScene, { passive: true });
addEventListener('resize', scheduleScene, { passive: true });

reduced.addEventListener('change', scheduleScene);
motionToggle.addEventListener('click', scheduleScene);

visual.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reduced.matches) return;

  const bounds = visual.getBoundingClientRect();

  tiltX =
    ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;

  tiltY =
    ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;

  scheduleScene();
});

visual.addEventListener('pointerleave', () => {
  tiltX = 0;
  tiltY = 0;
  scheduleScene();
});

scheduleScene();

const opening = document.querySelector('.opening');
const afterOpening = document.querySelector('header');

// A bounded set of composited particles, shared by the opening and the page.
const rain = document.createElement('div');
rain.className = 'star-rain';
for (let index = 0; index < 24; index++) {
  const star = document.createElement('span');
  star.className = 'rain-star';
  const position = (index + 0.5) / 24;
  star.style.setProperty('--x', 'calc(' + (position * 100).toFixed(2) + 'vw + ' + (position * 90).toFixed(2) + 'vh)');
  star.style.setProperty('--size', (index % 6 === 0 ? 9 : 2.5 + index % 3 * 0.7) + 'px');
  const duration = 17 + index % 9 * 2.1;
  star.style.setProperty('--fall-time', duration + 's');
  star.style.setProperty('--fall-delay', (-duration * ((index * 0.317) % 1)).toFixed(2) + 's');
  rain.append(star);
}
sky.append(rain);

let openingTimer;
let meteorObserver;
function finishOpening() {
  clearTimeout(openingTimer);
  meteorObserver?.disconnect();
  sky.setAttribute('data-falling', '');
  opening.setAttribute('data-finished', '');
}

document.addEventListener('visibilitychange', () => {
  sky.toggleAttribute('data-hidden', document.hidden);
});
if (reduced.matches) finishOpening();
reduced.addEventListener('change', () => {
  if (reduced.matches) finishOpening();
});


function prepareMeteor() {
  if (reduced.matches || opening.hasAttribute('data-finished')) {
    return;
  }

  const { width, height } = opening.getBoundingClientRect();

  if (width < 100 || height < 100) return;

  const point = (x, y) =>
    (x * width).toFixed(1) + ' ' +
    (y * height).toFixed(1);

  const route = [
    'M ' + point(1.04, -0.08),
    'C ' + point(0.92, 0.08) + ' ' +
           point(0.72, 0.12) + ' ' +
           point(0.55, 0.31),
    'S ' + point(0.34, 0.69) + ' ' +
           point(0.48, 0.70),
    'S ' + point(0.72, 0.55) + ' ' +
           point(0.62, 0.43),
    'S ' + point(0.47, 0.43) + ' ' +
           point(0.50, 0.50)
  ].join(' ');

  opening.style.setProperty(
    '--meteor-path',
    'path("' + route + '")'
  );

  if (!opening.hasAttribute('data-flight')) {
    opening.setAttribute('data-flight', '');
    openingTimer = setTimeout(completeOpening, 4200);
  }
}

function completeOpening() {
  if (opening.hasAttribute('data-finished')) return;
  finishOpening();
  if (reduced.matches || location.hash || window.scrollY > 8 ||
      document.activeElement !== document.body) return;
  afterOpening.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Measure after styles and layout settle, including on a slow mobile connection.
function startOpening() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!CSS.supports('offset-path', 'path("M 0 0 L 1 1")')) {
      completeOpening();
      return;
    }
    prepareMeteor();
    if (!opening.hasAttribute('data-finished')) {
      meteorObserver = new ResizeObserver(prepareMeteor);
      meteorObserver.observe(opening);
    }
  }));
}
if (document.readyState === 'complete') startOpening();
else window.addEventListener('load', startOpening, { once: true });

opening
  .querySelector('.star-flight')
  .addEventListener('animationend', event => {
    if (event.animationName !== 'meteor-flight') return;
    if (opening.hasAttribute('data-finished')) return;
    finishOpening();
    if (
      reduced.matches ||
      location.hash ||
      window.scrollY > 8 ||
      document.activeElement !== document.body
    ) {
      return;
    }

    afterOpening.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });


const vpnDemo = document.querySelector('.vpn-demo');
const vpnDemoToggle = document.querySelector('#vpn-demo-toggle');
const vpnDemoStatus = document.querySelector('#vpn-demo-status');
const vpnDemoFeedback = document.querySelector('#vpn-demo-feedback');
let connectionTimer;

function connectedDemo() {
  vpnDemo.dataset.state = 'connected';
  vpnDemoStatus.textContent = 'Подключён';
  vpnDemoFeedback.textContent = 'Трафик браузера проходит через Xray к серверу VPN.';
  vpnDemoToggle.textContent = 'Отключить';
  vpnDemoToggle.disabled = false;
  vpnDemoToggle.setAttribute('aria-pressed', 'true');
}

vpnDemoToggle.addEventListener('click', () => {
  clearTimeout(connectionTimer);
  if (vpnDemo.dataset.state === 'connected') {
    vpnDemo.dataset.state = 'off';
    vpnDemoStatus.textContent = 'Выключен';
    vpnDemoFeedback.textContent = 'Соединение отключено. Можно подключиться ещё раз.';
    vpnDemoToggle.textContent = 'Подключить';
    vpnDemoToggle.setAttribute('aria-pressed', 'false');
    return;
  }
  vpnDemo.dataset.state = 'connecting';
  vpnDemoStatus.textContent = 'Подключение…';
  vpnDemoFeedback.textContent = 'Создаётся соединение с сервером VPN…';
  vpnDemoToggle.disabled = true;
  vpnDemoToggle.textContent = 'Подключение…';
  if (reduced.matches) connectedDemo();
  else connectionTimer = setTimeout(connectedDemo, 1700);
});

const adblockDemo = document.querySelector('.adblock-demo');
const adblockPlay = document.querySelector('#adblock-demo-play');
const adblockFeedback = document.querySelector('#adblock-demo-feedback');
const blockedCount = document.querySelector('#blocked-count');
const adSlots = [...document.querySelectorAll('.ad-slot')];
const filterTimers = [];

adblockPlay.addEventListener('click', () => {
  filterTimers.forEach(clearTimeout);
  filterTimers.length = 0;
  adSlots.forEach(slot => slot.removeAttribute('data-blocked'));
  blockedCount.textContent = '0';
  adblockDemo.dataset.state = 'filtering';
  adblockPlay.disabled = true;
  adblockFeedback.textContent = 'Фильтры проверяют рекламные блоки…';

  function blockSlot(slot, index) {
    slot.setAttribute('data-blocked', '');
    blockedCount.textContent = String(index + 1);
    if (index === adSlots.length - 1) {
      adblockDemo.dataset.state = 'blocked';
      adblockPlay.disabled = false;
      adblockPlay.textContent = 'Повторить';
      adblockFeedback.textContent = 'Три рекламных блока скрыты. Содержимое страницы остаётся на месте.';
    }
  }

  adSlots.forEach((slot, index) => {
    if (reduced.matches) blockSlot(slot, index);
    else filterTimers.push(setTimeout(() => blockSlot(slot, index), 320 + index * 570));
  });
});


const vpnVisibility = new IntersectionObserver(entries => {
  for (const entry of entries) {
    entry.target.toggleAttribute('data-visible', entry.isIntersecting);
  }
}, { threshold: 0.1 });
vpnVisibility.observe(vpnDemo);
