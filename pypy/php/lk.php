<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Личный кабинет пациента</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="../css/style.css">
</head>

<body>
    <?php include "../html/header.html" ?>

    <div class="container main-content">
        <!-- Боковое меню -->
        <?php include "../html/menu.html" ?>
        <!-- Основной контент -->
        <main class="content">
            <!-- Главная страница -->
            <?php include "../html/dashboard.html" ?>

            <!-- Мои записи -->
            <?php include "../html/appointments.html" ?>
            <!-- Новая запись -->
            <?php include "../html/new-appointment.html" ?>
            <!-- Медицинская карта -->
            <?php include "../html/medical-records.html" ?>
            <!-- Рецепты -->
            <?php include "../html/prescriptions.html" ?>
            <!-- Мои врачи -->
            <?php include "../html/doctors.html" ?>

            <!-- Настройки профиля -->
            <?php include "../html/profile.html" ?>
        </main>
    </div>
</body>
<script src="../js/script.js"></script>

</html>