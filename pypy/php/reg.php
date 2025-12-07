<?php
// php/reg.php
// Включаем буферизацию В САМОМ НАЧАЛЕ
ob_start();

// Подключаем конфигурацию БД
require_once '../config/database.php';

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Очищаем буфер и перенаправляем
    ob_end_clean();
    header("Location: ../html/reg.html");
    exit();
}

// Получаем данные
$email = trim($_POST['email'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

// Валидация
$errors = [];

if (empty($email)) {
    $errors[] = "Email обязателен";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Некорректный email";
}

if (empty($full_name)) {
    $errors[] = "ФИО обязательно";
} elseif (strlen($full_name) < 2) {
    $errors[] = "ФИО должно содержать не менее 2 символов";
}

if (empty($password)) {
    $errors[] = "Пароль обязателен";
} elseif (strlen($password) < 6) {
    $errors[] = "Пароль должен быть не менее 6 символов";
} elseif ($password !== $confirm_password) {
    $errors[] = "Пароли не совпадают";
}

// Если есть ошибки, показываем их
if (!empty($errors)) {
    ob_end_clean();
    // Начинаем сессию для передачи ошибок
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['reg_errors'] = $errors;
    header("Location: ../html/reg.html");
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
    $_SESSION['reg_errors'] = ["Ошибка подключения к базе данных"];
    header("Location: ../html/reg.html");
    exit();
}

try {
    // Проверяем существование пользователя
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    
    if ($checkStmt->rowCount() > 0) {
        ob_end_clean();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['reg_errors'] = ["Пользователь с таким email уже существует"];
        header("Location: ../html/reg.html");
        exit();
    }
    
    // Хешируем пароль
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Добавляем пользователя
    $insertStmt = $conn->prepare(
        "INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)"
    );
    
    $result = $insertStmt->execute([$email, $full_name, $hashed_password]);
    
    if ($result) {
        // Создаем сессию
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Сохраняем данные пользователя
        $_SESSION['user_id'] = $conn->lastInsertId();
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $full_name;
        
        // Очищаем буфер и перенаправляем в ЛК
        ob_end_clean();
        header("Location: ../html/lk.html");
        exit();
    } else {
        throw new Exception("Не удалось добавить пользователя");
    }
    
} catch (Exception $e) {
    ob_end_clean();
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['reg_errors'] = ["Ошибка при регистрации: " . $e->getMessage()];
    header("Location: ../html/reg.html");
    exit();
}
?>