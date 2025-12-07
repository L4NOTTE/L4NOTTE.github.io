<?php
// php/logout.php
ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Уничтожаем сессию
session_destroy();

// Очищаем куки сессии
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

ob_end_clean();
header("Location: ../html/login.html");
exit();
?>