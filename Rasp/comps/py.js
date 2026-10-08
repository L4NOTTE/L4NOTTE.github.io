function toggleContent(link, id) {
	const content = document.getElementById(id);
	if (!content) return;
	if (content.style.display === "grid") {
		content.style.display = "none";
		link.classList.remove("active");
	} else {
		content.style.display = "grid";
		link.classList.add("active");
	}
}

let inIframe = false;
try {
	inIframe = window.self !== window.top;
} catch (e) {
	inIframe = true;
}

// Раньше здесь был вызов без проверки: на странице нет #back-link и #themeSwitch,
// поэтому скрипт падал с ошибкой. Теперь элементы проверяются.
const backLink = document.getElementById('back-link');
if (inIframe && backLink) backLink.style.display = 'none';

const switcher = document.getElementById('themeSwitch');
if (switcher) {
	switcher.addEventListener('click', () => {
		const body = document.body;
		if (body.classList.contains('light')) {
			body.className = 'dark';
			localStorage.setItem('theme', 'dark');
		} else {
			body.className = 'light';
			localStorage.setItem('theme', 'light');
		}
	});
}
