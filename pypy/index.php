<?php
// index.php
ob_start();

// Проверяем сессию
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Проверяем авторизацию
if (isset($_SESSION['user_id'])) {
    // Пользователь авторизован - показываем ЛК
    ob_end_clean();
    readfile("html/lk.php");
} else {
    // Пользователь не авторизован - показываем вход
    ob_end_clean();
    readfile("html/login.html");
}
?>