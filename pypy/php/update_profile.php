<?php
// php/update_profile.php
ob_start();

// Начинаем сессию
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Проверяем авторизацию
if (!isset($_SESSION['user_id'])) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit();
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса']);
    exit();
}

// Подключаем БД
require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
    exit();
}

try {
    $user_id = $_SESSION['user_id'];
    
    // Получаем данные из формы
    $full_name = trim($_POST['full_name'] ?? '');
    $birth_date = $_POST['birth_date'] ?? null;
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Валидация
    if (empty($full_name)) {
        throw new Exception("ФИО обязательно");
    }
    
    if (empty($email)) {
        throw new Exception("Email обязателен");
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Некорректный email");
    }
    
    // Проверяем уникальность email
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $check_stmt->execute([$email, $user_id]);
    
    if ($check_stmt->rowCount() > 0) {
        throw new Exception("Этот email уже используется другим пользователем");
    }
    
    // Проверяем пароль, если он указан
    if (!empty($new_password)) {
        if (strlen($new_password) < 6) {
            throw new Exception("Пароль должен быть не менее 6 символов");
        }
        
        if ($new_password !== $confirm_password) {
            throw new Exception("Пароли не совпадают");
        }
    }
    
    // Обновляем данные пользователя
    if (!empty($new_password)) {
        // Обновляем с паролем
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $update_stmt = $conn->prepare(
            "UPDATE users SET full_name = ?, birth_date = ?, phone = ?, email = ?, address = ?, password = ? WHERE id = ?"
        );
        $result = $update_stmt->execute([$full_name, $birth_date, $phone, $email, $address, $hashed_password, $user_id]);
    } else {
        // Обновляем без пароля
        $update_stmt = $conn->prepare(
            "UPDATE users SET full_name = ?, birth_date = ?, phone = ?, email = ?, address = ? WHERE id = ?"
        );
        $result = $update_stmt->execute([$full_name, $birth_date, $phone, $email, $address, $user_id]);
    }
    
    if ($result) {
        // Обновляем данные в сессии
        $_SESSION['user_name'] = $full_name;
        $_SESSION['user_email'] = $email;
        
        ob_end_clean();
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Данные обновлены']);
    } else {
        throw new Exception("Не удалось обновить данные");
    }
    
} catch (Exception $e) {
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>