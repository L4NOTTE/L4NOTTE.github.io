<?php
// html/lk.php
ob_start();

// Начинаем сессию
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Проверяем авторизацию
if (!isset($_SESSION['user_id'])) {
    ob_end_clean();
    header("Location: login.html");
    exit();
}

// Получаем данные пользователя через API
$user_data = null;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://" . $_SERVER['HTTP_HOST'] . "/pypy/php/lk.php");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Cookie: ' . session_name() . '=' . session_id()
]);

$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $data = json_decode($response, true);
    if (isset($data['user'])) {
        $user_data = $data['user'];
    } else {
        // Если ошибка, выходим
        ob_end_clean();
        session_destroy();
        header("Location: login.html");
        exit();
    }
} else {
    // Если не удалось получить данные
    ob_end_clean();
    session_destroy();
    header("Location: login.html");
    exit();
}

// Формируем инициалы для аватара
$initials = 'NN';
if (!empty($user_data['full_name'])) {
    $name_parts = explode(' ', $user_data['full_name']);
    $initials = '';
    foreach ($name_parts as $part) {
        if (!empty($part)) {
            $initials .= mb_substr($part, 0, 1, 'UTF-8');
        }
        if (mb_strlen($initials, 'UTF-8') >= 2) {
            break;
        }
    }
    $initials = mb_strtoupper($initials, 'UTF-8');
}

// Формируем короткое имя
$name_parts = explode(' ', trim($user_data['full_name']));
if (count($name_parts) >= 2) {
    $short_name = $name_parts[0] . ' ' . $name_parts[1]; // Только имя и фамилия
} else {
    $short_name = $user_data['full_name'];
}

ob_end_clean();
?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Личный кабинет пациента</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="../css/style.css" />
</head>

<body>
    <header>
        <div class="container header-container">
            <div class="logo">
                <i class="fas fa-heartbeat"></i>
                <span>МедКлиент</span>
            </div>
            <div class="user-info">
                <div class="user-avatar" id="userAvatar"><?php echo htmlspecialchars($initials); ?></div>
                <div>
                    <div class="user-name" id="userName"><?php echo htmlspecialchars($short_name); ?></div>
                    <div class="user-id" id="userId">ID: <?php echo htmlspecialchars($user_data['id']); ?></div>
                </div>
                <form action="../php/logout.php" method="POST" class="logout-form">
                    <button class="logout-btn" type="submit">
                        <i class="fas fa-sign-out-alt"></i> Выйти
                    </button>
                </form>
            </div>
        </div>
    </header>

    <div class="container main-content">
        <!-- Боковое меню -->
        <nav class="sidebar">
            <div class="menu-item active" onclick="showPage('dashboard')">
                <i class="fas fa-home"></i>
                <span>Главная</span>
            </div>
            <div class="menu-item" onclick="showPage('appointments')">
                <i class="fas fa-calendar-alt"></i>
                <span>Мои записи</span>
            </div>
            <div class="menu-item" onclick="showPage('medical-records')">
                <i class="fas fa-file-medical"></i>
                <span>Медицинская карта</span>
            </div>
            <div class="menu-item" onclick="showPage('prescriptions')">
                <i class="fas fa-pills"></i>
                <span>Рецепты</span>
            </div>
            <div class="menu-item" onclick="showPage('doctors')">
                <i class="fas fa-user-md"></i>
                <span>Мои врачи</span>
            </div>
            <div class="menu-item" onclick="showPage('profile')">
                <i class="fas fa-user-cog"></i>
                <span>Настройки профиля</span>
            </div>
        </nav>

        <!-- Основной контент -->
        <main class="content">
            <!-- Главная страница -->
            <div id="dashboard" class="page active">
                <h1 class="page-title">Добро пожаловать, <?php echo htmlspecialchars($user_data['full_name']); ?>!</h1>

                <div class="notification info">
                    <div>
                        <i class="fas fa-info-circle"></i> Добро пожаловать в ваш личный кабинет
                    </div>
                    <button
                        class="close-notification"
                        onclick="this.parentElement.style.display='none'">
                        &times;
                    </button>
                </div>

                <div class="info-cards">
                    <div class="card">
                        <h3 class="card-title">
                            <i class="fas fa-user"></i> Ваш профиль
                        </h3>
                        <div class="card-content">
                            <p><strong>Email:</strong> <?php echo htmlspecialchars($user_data['email']); ?></p>
                            <p><strong>Телефон:</strong> <?php echo !empty($user_data['phone']) ? htmlspecialchars($user_data['phone']) : 'Не указан'; ?></p>
                            <?php if (!empty($user_data['birth_date'])):
                                $birth_date = new DateTime($user_data['birth_date']);
                            ?>
                                <p><strong>Дата рождения:</strong> <?php echo $birth_date->format('d.m.Y'); ?></p>
                            <?php else: ?>
                                <p><strong>Дата рождения:</strong> Не указана</p>
                            <?php endif; ?>
                            <p><strong>Адрес:</strong> <?php echo !empty($user_data['address']) ? htmlspecialchars($user_data['address']) : 'Не указан'; ?></p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">
                            <i class="fas fa-heartbeat"></i> Быстрые действия
                        </h3>
                        <div class="card-content">
                            <p>• <a href="javascript:void(0)" onclick="showPage('new-appointment')">Записаться на прием</a></p>
                            <p>• <a href="javascript:void(0)" onclick="showPage('profile')">Редактировать профиль</a></p>
                            <p>• <a href="javascript:void(0)" onclick="showPage('medical-records')">Посмотреть медицинскую карту</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Настройки профиля -->
            <div id="profile" class="page">
                <h1 class="page-title">Настройки профиля</h1>

                <div class="notification success" id="profile-success" style="display: none">
                    <div>
                        <i class="fas fa-check-circle"></i> Данные успешно сохранены!
                    </div>
                    <button class="close-notification" onclick="this.parentElement.style.display='none'">
                        &times;
                    </button>
                </div>

                <form id="profile-form">
                    <div class="form-group">
                        <label for="full-name">ФИО:</label>
                        <input type="text" id="full-name" value="<?php echo htmlspecialchars($user_data['full_name']); ?>" />
                    </div>

                    <div class="form-group">
                        <label for="birth-date">Дата рождения:</label>
                        <input type="date" id="birth-date" value="<?php echo !empty($user_data['birth_date']) ? htmlspecialchars($user_data['birth_date']) : ''; ?>" />
                    </div>

                    <div class="form-group">
                        <label for="phone">Телефон:</label>
                        <input type="tel" id="phone" value="<?php echo !empty($user_data['phone']) ? htmlspecialchars($user_data['phone']) : ''; ?>" />
                    </div>

                    <div class="form-group">
                        <label for="email">Электронная почта:</label>
                        <input type="email" id="email" value="<?php echo htmlspecialchars($user_data['email']); ?>" />
                    </div>

                    <div class="form-group">
                        <label for="address">Адрес:</label>
                        <input type="text" id="address" value="<?php echo !empty($user_data['address']) ? htmlspecialchars($user_data['address']) : ''; ?>" />
                    </div>

                    <div class="form-group">
                        <label for="new-password">Новый пароль (оставьте пустым, если не хотите менять):</label>
                        <input type="password" id="new-password" />
                    </div>

                    <div class="form-group">
                        <label for="confirm-password">Подтвердите новый пароль:</label>
                        <input type="password" id="confirm-password" />
                    </div>

                    <button type="button" onclick="saveProfile()">
                        Сохранить изменения
                    </button>
                </form>
            </div>

            <!-- Остальные страницы (appointments, medical-records и т.д.) -->
            <!-- Можно скопировать из вашего старого lk.html -->
            <div id="appointments" class="page">
                <h1 class="page-title">Мои записи на прием</h1>
                <button onclick="showPage('new-appointment')" style="margin-bottom: 20px">
                    <i class="fas fa-plus"></i> Записаться на прием
                </button>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Время</th>
                                <th>Врач</th>
                                <th>Специальность</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15.06.2023</td>
                                <td>10:30</td>
                                <td>Петрова Е.С.</td>
                                <td>Терапевт</td>
                                <td><span class="status confirmed">Подтвержден</span></td>
                                <td>
                                    <button class="cancel-btn" onclick="cancelAppointment(1)">
                                        Отменить
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Добавьте остальные страницы из вашего старого lk.html -->
        </main>
    </div>
    <script src="../js/script.js"></script>
</body>

</html>