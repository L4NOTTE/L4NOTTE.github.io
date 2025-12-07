<?php
// login.php
require_once '../php/config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        die("Заполните все поля");
    }
    
    // Поиск пользователя
    $stmt = $pdo->prepare("SELECT id, email, password, full_name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        // Успешный вход
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'];
        
        header("Location: ../html/lk.html");
        exit();
    } else {
        die("Неверный email или пароль");
    }
}
?>