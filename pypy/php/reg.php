<?php
// reg.php
require_once '../php/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    
    // Валидация
    if (empty($email) || empty($password) || empty($full_name)) {
        die("Все поля обязательны для заполнения");
    }
    
    // Проверка email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Некорректный email адрес");
    }
    
    // Проверка существования пользователя
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        die("Пользователь с таким email уже существует");
    }
    
    // Хеширование пароля
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Вставка нового пользователя
    $stmt = $pdo->prepare("INSERT INTO users (email, password, full_name, birth_date, phone, address) 
                          VALUES (?, ?, ?, ?, ?, ?)");
    
    try {
        $stmt->execute([
            $email,
            $hashed_password,
            $full_name,
            '2000-01-01', // дата по умолчанию
            '',
            ''
        ]);
        
        // Автоматический вход после регистрации
        session_start();
        $_SESSION['user_id'] = $pdo->lastInsertId();
        $_SESSION['email'] = $email;
        $_SESSION['full_name'] = $full_name;
        
        header("Location: ../html/lk.html");
        exit();
        
    } catch(PDOException $e) {
        die("Ошибка при регистрации: " . $e->getMessage());
    }
}
?>