<?php
// config_simple.php
$host = 'localhost';
$dbname = 'medclinic';
$username = 'root';
$password = 'root'; // Для OpenServer
$port = 3306;

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // Проверяем соединение
    $pdo->query("SELECT 1");
    
} catch (PDOException $e) {
    // Пробуем создать базу если её нет
    try {
        // Подключаемся к MySQL без базы
        $temp_pdo = new PDO("mysql:host=$host;port=$port", $username, $password);
        
        // Создаем базу
        $temp_pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        // Подключаемся к созданной базе
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        // Создаем таблицы
        $sql = file_get_contents(__DIR__ . '../sql/information.sql');
        $pdo->exec($sql);
        
    } catch (PDOException $e2) {
        die("❌ Ошибка подключения: " . $e2->getMessage() . 
            "<br>Проверьте:<br>" .
            "1. Запущен ли OpenServer<br>" .
            "2. Правильный ли пароль (по умолчанию 'root')<br>" .
            "3. Запущен ли MySQL модуль");
    }
}

return $pdo;
?>