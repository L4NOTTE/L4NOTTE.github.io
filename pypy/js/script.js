// Переключение между страницами
function showPage(pageId) {
  // Скрыть все страницы
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Показать выбранную страницу
  document.getElementById(pageId).classList.add("active");

  // Обновить активный пункт меню
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Найти соответствующий пункт меню (кроме страницы new-appointment)
  if (pageId !== "new-appointment") {
    const menuItem = Array.from(document.querySelectorAll(".menu-item")).find(
      (item) => {
        return (
          item.getAttribute("onclick") &&
          item.getAttribute("onclick").includes(pageId)
        );
      }
    );

    if (menuItem) {
      menuItem.classList.add("active");
    }
  }
}

// Отмена записи
function cancelAppointment(id) {
  if (confirm("Вы уверены, что хотите отменить запись?")) {
    alert(
      `Запись #${id} отменена. В реальном приложении здесь будет запрос к серверу.`
    );
    // В реальном приложении: отправка AJAX запроса на сервер
  }
}

// Создание новой записи
function createAppointment() {
  const doctor = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!doctor || !date || !time) {
    alert("Пожалуйста, заполните все обязательные поля!");
    return;
  }

  alert(
    `Запись создана! Врач: ${doctor}, Дата: ${date}, Время: ${time}. В реальном приложении здесь будет запрос к серверу.`
  );
  showPage("appointments");

  // Очистка формы
  document.getElementById("doctor").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
  document.getElementById("symptoms").value = "";
}

// Сохранение профиля
function saveProfile() {
  const fullName = document.getElementById("full-name").value;
  const birthDate = document.getElementById("birth-date").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  if (!fullName || !birthDate || !phone || !email || !address) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  // Показываем уведомление об успехе
  document.getElementById("profile-success").style.display = "flex";

  // Прокручиваем к верху страницы
  window.scrollTo(0, 0);

  // Обновляем имя в шапке
  const nameParts = fullName.split(" ");
  const shortName =
    nameParts[0] +
    " " +
    (nameParts[1] ? nameParts[1].charAt(0) + "." : "") +
    (nameParts[2] ? nameParts[2].charAt(0) + "." : "");
  document.querySelector(".user-name").textContent = shortName;

  // Обновляем инициалы в аватаре
  const initials = (
    nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : "")
  ).toUpperCase();
  document.querySelector(".user-avatar").textContent = initials;
}

// Инициализация даты в форме записи (завтрашний день)
document.addEventListener("DOMContentLoaded", function () {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];
  document.getElementById("date").min = formattedDate;
  document.getElementById("date").value = formattedDate;
});
