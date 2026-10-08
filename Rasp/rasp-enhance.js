/* rasp-enhance.js — надстройка над существующей разметкой /rasp.
   Ничего не меняет на сервере: читает готовые таблицы и добавляет
   выбор группы/преподавателя, карточки, подсветку текущей пары. */
(function () {
  'use strict';

  var MONTHS = {января:0,февраля:1,марта:2,апреля:3,мая:4,июня:5,июля:6,августа:7,сентября:8,октября:9,ноября:10,декабря:11};
  var MONTH_NAMES = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var STORE = 'rasp_state_v1';

  var days = {};        // key -> {key, date, label, wd}
  var byGroup = {};     // group -> {dayKey: [lessons]}
  var groupList = [];
  var teacherList = [];
  var all = [];         // все занятия (для режима преподавателя)

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toMin(t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; }
  function plural(n) { var m = n % 10, h = n % 100; if (m === 1 && h !== 11) return 'пара'; if (m >= 2 && m <= 4 && (h < 12 || h > 14)) return 'пары'; return 'пар'; }
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {} }

  /* ---------- разбор ячейки ---------- */
  var PLACE = /^(Дистанционно|Спортзал|Тренажерный зал|Экскурсия|\d+[а-яa-z]?(?:\s*\/\s*\d+[а-яa-z]?)?)$/i;
  function parseCell(td) {
    var ps = [].map.call(td.querySelectorAll('p'), function (p) { return norm(p.textContent); }).filter(Boolean);
    if (!ps.length) { var t = norm(td.textContent); if (!t) return null; ps = [t]; }
    var subject = ps[0], teacher = '', place = '';
    if (ps.length >= 3) { place = ps[ps.length - 1]; teacher = ps.slice(1, -1).join(' '); }
    else if (ps.length === 2) {
      if (PLACE.test(ps[1])) place = ps[1];
      else {
        var m = ps[1].match(/^(.*?)\s+(Дистанционно|Спортзал|Тренажерный зал|Экскурсия|\d+[а-яa-z]?)$/i);
        if (m) { teacher = m[1]; place = m[2]; } else teacher = ps[1];
      }
    }
    teacher = teacher.replace(/\s*\/\s*/g, ' / ').trim();
    return { subject: subject, teacher: teacher, place: place };
  }

  /* ---------- разбор всех таблиц ---------- */
  function parse() {
    var wraps = document.querySelectorAll('.table-wrapper');
    wraps.forEach(function (wrap) {
      var table = wrap.querySelector('table');
      var titleEl = wrap.previousElementSibling;
      var after = wrap.nextElementSibling;
      if (after && /^Зав\./.test(norm(after.textContent))) after.classList.add('rasp-sign');
      if (!table || !titleEl) return;
      var title = norm(titleEl.textContent);
      titleEl.classList.add('rasp-day-title');
      var dm = title.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
      if (!dm || MONTHS[dm[2].toLowerCase()] === undefined) return;
      var date = new Date(+dm[3], MONTHS[dm[2].toLowerCase()], +dm[1]);
      var key = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
      var wdm = title.match(/\(([^)]+)\)/);
      var wd = wdm ? wdm[1].charAt(0).toUpperCase() + wdm[1].slice(1) : '';
      days[key] = { key: key, date: date, wd: wd, label: +dm[1] + ' ' + MONTH_NAMES[date.getMonth()] };

      var rows = table.rows;
      if (!rows.length) return;
      var cols = [null], hc = rows[0].cells;
      for (var i = 1; i < hc.length; i++) {
        var span = hc[i].colSpan || 1, g = norm(hc[i].textContent);
        if (!g) { for (var z = 0; z < span; z++) cols.push(null); continue; }
        hc[i].classList.add('grp'); hc[i].setAttribute('data-group', g); hc[i].title = 'Показать расписание группы ' + g;
        if (!byGroup[g]) { byGroup[g] = {}; groupList.push(g); }
        if (!byGroup[g][key]) byGroup[g][key] = [];
        for (var k = 0; k < span; k++) cols.push({ g: g, sub: k + 1, of: span });
      }

      for (var r = 1; r < rows.length; r++) {
        var cells = rows[r].cells;
        var pp = [].map.call(cells[0].querySelectorAll('p'), function (p) { return norm(p.textContent); }).filter(Boolean);
        var n = parseInt(pp[0], 10);
        if (!n) continue;
        var start = (pp[1] || '').replace('.', ':'), end = (pp[pp.length - 1] || '').replace('.', ':');
        var ci = 1;
        for (var c = 1; c < cells.length; c++) {
          var td = cells[c], sp = td.colSpan || 1;
          var info = parseCell(td);
          if (info) {
            if (/Дистанционно/i.test(td.textContent)) td.classList.add('is-remote');
            var cov = cols.slice(ci, ci + sp).filter(Boolean), seen = {};
            cov.forEach(function (cc) {
              if (seen[cc.g]) return; seen[cc.g] = 1;
              var mine = cov.filter(function (x) { return x.g === cc.g; });
              var sub = mine.length < cc.of ? 'подгр. ' + mine.map(function (x) { return x.sub; }).join('+') : '';
              var les = { n: n, start: start, end: end, subject: info.subject, teacher: info.teacher, place: info.place, sub: sub, group: cc.g, key: key };
              byGroup[cc.g][key].push(les);
              all.push(les);
            });
          }
          ci += sp;
        }
      }
    });

    var tset = {};
    all.forEach(function (l) {
      l.teachers = l.teacher ? l.teacher.split(/\s*\/\s*/).filter(Boolean) : [];
      l.teachers.forEach(function (t) { tset[t] = 1; });
    });
    teacherList = Object.keys(tset).sort(function (a, b) { return a.localeCompare(b, 'ru'); });
  }

  /* ---------- карточки ---------- */
  function dayKeys() { return Object.keys(days).sort(); }

  function lessonsFor(mode, val, key) {
    if (mode === 'group') return (byGroup[val] && byGroup[val][key]) ? byGroup[val][key].slice() : null;
    var map = {}, out = [];
    all.forEach(function (l) {
      if (l.key !== key || l.teachers.indexOf(val) < 0) return;
      var id = l.n + '|' + l.subject + '|' + l.place;
      var g = l.group + (l.sub ? ' (' + l.sub + ')' : '');
      if (map[id]) { if (map[id].groups.indexOf(g) < 0) map[id].groups.push(g); }
      else { map[id] = { n: l.n, start: l.start, end: l.end, subject: l.subject, teacher: l.teacher, place: l.place, sub: '', groups: [g] }; out.push(map[id]); }
    });
    return out;
  }

  function lessonHTML(l, mode, nowMin) {
    var cls = 'rc-les', tags = '', left = '';
    var remote = /Дистанционно/i.test(l.place);
    if (remote) { cls += ' remote'; tags += '<span class="rc-tag r">дистанционно</span>'; }
    if (l.sub) tags += '<span class="rc-tag">' + esc(l.sub) + '</span>';
    if (nowMin !== null && l.start && l.end) {
      var s = toMin(l.start), e = toMin(l.end);
      if (nowMin >= s && nowMin < e) { cls += ' now'; tags += '<span class="rc-tag live">идёт сейчас</span>'; left = '<div class="rc-left">До конца пары: ' + (e - nowMin) + ' мин</div>'; }
      else if (nowMin < s && s - nowMin <= 30) left = '<div class="rc-left">Начало через ' + (s - nowMin) + ' мин</div>';
    }
    var who = mode === 'group' ? (l.teacher ? '<span>👤 ' + esc(l.teacher) + '</span>' : '')
                               : '<span>👥 ' + esc(l.groups.join(', ')) + '</span>';
    var where = l.place ? '<span>' + (remote ? '💻 ' : '📍 ') + esc(/^\d/.test(l.place) ? 'ауд. ' + l.place : l.place) + '</span>' : '';
    return '<div class="' + cls + '"><div class="rc-time"><b>' + l.n + '</b><span>' + esc(l.start) + '<br>' + esc(l.end) + '</span></div>' +
           '<div><div class="rc-subj">' + esc(l.subject) + tags + '</div><div class="rc-meta">' + who + where + '</div>' + left + '</div></div>';
  }

  function renderCards(mode, val) {
    var box = document.getElementById('rasp-cards');
    if (!val) { box.innerHTML = '<div class="rc-empty">Выберите ' + (mode === 'group' ? 'группу' : 'преподавателя') + ' в списке выше</div>'; return; }
    var now = new Date(), todayKey = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var h = '<div class="rc-head">' + (mode === 'group' ? 'Группа ' : '') + esc(val) + '</div>';
    var shown = 0, body = '';
    dayKeys().forEach(function (key) {
      var ls = lessonsFor(mode, val, key);
      if (ls === null) return;
      shown++;
      var d = days[key], isToday = key === todayKey;
      body += '<section class="rc-day"><div class="rc-dh' + (isToday ? ' today' : '') + '"><span>' + esc(d.wd) + (isToday ? ' · сегодня' : '') + '</span><small>' + esc(d.label) + '</small></div>';
      ls.sort(function (a, b) { return a.n - b.n; });
      if (!ls.length) body += '<div class="rc-empty">Занятий нет</div>';
      var prev = 0;
      ls.forEach(function (l) {
        if (prev && l.n - prev > 1) { var g = l.n - prev - 1; body += '<div class="rc-gap">Окно · ' + g + ' ' + plural(g) + '</div>'; }
        prev = Math.max(prev, l.n);
        body += lessonHTML(l, mode, isToday ? nowMin : null);
      });
      body += '</section>';
    });
    h += '<div class="rc-sub">' + (shown ? 'Дней в расписании: ' + shown : 'В расписании ничего не найдено') + '</div>' + body;
    box.innerHTML = h;
  }

  /* ---------- панель ---------- */
  var state = load();
  /* Собираем «Назад», поиск и переключение дней в одну аккуратную панель */
  function buildTop() {
    var link = document.querySelector('body > a.link');
    var form = document.querySelector('body > form');
    var nav = document.querySelector('body > .day-navigation');
    var first = link || form || nav;
    if (!first) return;
    var top = document.createElement('div'); top.id = 'rasp-top';
    first.parentNode.insertBefore(top, first);
    [link, form, nav].forEach(function (el) { if (el) top.appendChild(el); });
    var br = top.nextElementSibling;
    if (br && br.tagName === 'BR') br.parentNode.removeChild(br);
  }

  /* Тень у закреплённой колонки времени — только когда таблицу реально прокрутили */
  function watchScroll() {
    document.querySelectorAll('.table-wrapper').forEach(function (w) {
      function upd() { w.classList.toggle('is-scrolled', w.scrollLeft > 2); }
      w.addEventListener('scroll', upd, { passive: true }); upd();
    });
  }

  function init() {
    buildTop();
    parse();
    watchScroll();
    if (!groupList.length) return;

    var firstTitle = document.querySelector('.rasp-day-title');
    var bar = document.createElement('div'); bar.id = 'rasp-bar';
    bar.innerHTML = '<select id="rb-mode" aria-label="Режим"><option value="table">Все группы</option><option value="group">По группе</option><option value="teacher">По преподавателю</option></select>' +
                    '<select id="rb-val" aria-label="Выбор"></select>';
    var hint = document.createElement('div'); hint.id = 'rasp-hint';
    hint.textContent = 'Листайте таблицу вправо · нажмите на группу, чтобы открыть только её расписание';
    var cards = document.createElement('div'); cards.id = 'rasp-cards';
    var anchor = firstTitle || document.querySelector('.table-wrapper');
    anchor.parentNode.insertBefore(bar, anchor);
    anchor.parentNode.insertBefore(hint, anchor);
    anchor.parentNode.insertBefore(cards, anchor);

    var selMode = bar.querySelector('#rb-mode'), selVal = bar.querySelector('#rb-val');

    function fillVals() {
      var list = state.mode === 'teacher' ? teacherList : groupList;
      selVal.innerHTML = '<option value="">' + (state.mode === 'teacher' ? 'Выберите преподавателя' : 'Выберите группу') + '</option>' +
        list.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('');
      selVal.value = list.indexOf(state.val) >= 0 ? state.val : '';
      if (selVal.value === '') state.val = '';
    }
    function apply() {
      var table = state.mode !== 'group' && state.mode !== 'teacher';
      document.body.classList.toggle('mode-table', table);
      document.body.classList.toggle('mode-cards', !table);
      selMode.value = table ? 'table' : state.mode;
      selVal.style.display = table ? 'none' : '';
      if (!table) { fillVals(); renderCards(state.mode, state.val); }
      save(state);
    }

    selMode.onchange = function () { state.mode = selMode.value; state.val = ''; apply(); };
    selVal.onchange = function () { state.val = selVal.value; apply(); };
    document.addEventListener('click', function (e) {
      var th = e.target.closest ? e.target.closest('td.grp') : null;
      if (!th) return;
      state.mode = 'group'; state.val = th.getAttribute('data-group'); apply();
      window.scrollTo(0, 0);
      try { if (window.frameElement) window.frameElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) {}
    });

    // На узком экране без сохранённого выбора сразу предлагаем «По группе» — таблица на 320px неудобна
    if (!state.mode && window.innerWidth < 700) state.mode = 'group';
    if (state.mode !== 'group' && state.mode !== 'teacher') state.mode = 'table';
    apply();
    setInterval(function () { if (state.mode === 'group' || state.mode === 'teacher') renderCards(state.mode, state.val); }, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
