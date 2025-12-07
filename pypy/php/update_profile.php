<?php
// update_profile.php
require_once '../php/config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => false, 'message' => 'Не авторизован']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    
    $full_name = $_POST['full_name'] ?? '';
    $birth_date = $_POST['birth_date'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $new_password = $_POST['password'] ?? '';
    
    // Обновление данных
    if (!empty($new_password)) {
        // Если пользователь хочет изменить пароль
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, birth_date = ?, phone = ?, email = ?, address = ?, password = ? WHERE id = ?");
        $stmt->execute([$full_name, $birth_date, $phone, $email, $address, $hashed_password, $user_id]);
    } else {
        // Без изменения пароля
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, birth_date = ?, phone = ?, email = ?, address = ? WHERE id = ?");
        $stmt->execute([$full_name, $birth_date, $phone, $email, $address, $user_id]);
    }
    
    // Обновляем сессию
    $_SESSION['full_name'] = $full_name;
    $_SESSION['email'] = $email;
    
    echo json_encode(['success' => true, 'message' => 'Данные обновлены']);
}
?>