<?php
// php/login.php
ob_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    header("Location: ../html/login.html");
    exit();
}

require_once '../config/database.php';

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Валидация
$errors = [];

if (empty($email)) {
    $errors[] = "Email обязателен";
}

if (empty($password)) {
    $errors[] = "Пароль обязателен";
}

if (!empty($errors)) {
    ob_end_clean();
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['login_errors'] = $errors;
    header("Location: ../html/login.html");
    exit();
}

// Подключаемся к БД
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    ob_end_clean();
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['login_errors'] = ["Ошибка подключения к базе данных"];
    header("Location: ../html/login.html");
    exit();
}

try {
    // Ищем пользователя
    $stmt = $conn->prepare("SELECT id, email, full_name, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() === 0) {
        ob_end_clean();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['login_errors'] = ["Пользователь не найден"];
        header("Location: ../html/login.html");
        exit();
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Проверяем пароль
    if (password_verify($password, $user['password'])) {
        // Создаем сессию
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['full_name'];
        
        ob_end_clean();
        header("Location: ../html/lk.html");
        exit();
    } else {
        ob_end_clean();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['login_errors'] = ["Неверный пароль"];
        header("Location: ../html/login.html");
        exit();
    }
    
} catch (Exception $e) {
    ob_end_clean();
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['login_errors'] = ["Ошибка сервера: " . $e->getMessage()];
    header("Location: ../html/login.html");
    exit();
}
?>