<?php
// setup_database.php
echo "<h2>Настройка базы данных</h2>";

// Подключаемся к MySQL без базы данных
try {
    $pdo = new PDO('mysql:host=localhost;port=3306', 'root', 'root', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "✅ Успешное подключение к MySQL серверу<br>";
    
    // Создаем базу данных
    $pdo->exec("CREATE DATABASE IF NOT EXISTS medclinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ База данных 'medclinic' создана<br>";
    
    // Выбираем базу данных
    $pdo->exec("USE medclinic");
    
    // Читаем SQL файл
    $sql_file = __DIR__ . '/../sql/information.sql';
    
    if (file_exists($sql_file)) {
        $sql = file_get_contents($sql_file);
        $pdo->exec($sql);
        echo "✅ Таблицы созданы из файла information.sql<br>";
    } else {
        // Создаем таблицы вручную
        $sql = "
        CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `email` VARCHAR(100) UNIQUE NOT NULL,
            `password` VARCHAR(255) NOT NULL,
            `full_name` VARCHAR(150) NOT NULL,
            `birth_date` DATE DEFAULT '2000-01-01',
            `phone` VARCHAR(20),
            `address` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS `appointments` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `doctor_name` VARCHAR(150) NOT NULL,
            `specialization` VARCHAR(100) NOT NULL,
            `appointment_date` DATE NOT NULL,
            `appointment_time` TIME NOT NULL,
            `symptoms` TEXT,
            `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS `medical_records` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `visit_date` DATE NOT NULL,
            `doctor_name` VARCHAR(150) NOT NULL,
            `diagnosis` TEXT NOT NULL,
            `recommendations` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS `prescriptions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `medicine_name` VARCHAR(100) NOT NULL,
            `dosage` VARCHAR(50) NOT NULL,
            `doctor_name` VARCHAR(150) NOT NULL,
            `issue_date` DATE NOT NULL,
            `expiry_date` DATE NOT NULL,
            `status` ENUM('active', 'expired') DEFAULT 'active',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        
        $queries = explode(';', $sql);
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                $pdo->exec($query . ';');
            }
        }
        echo "✅ Таблицы созданы<br>";
    }
    
    // Добавляем тестового пользователя
    $hashed_password = password_hash('password123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (email, password, full_name, birth_date, phone, address) 
                          VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        'test@example.com',
        $hashed_password,
        'Иванов Иван Иванович',
        '1985-05-15',
        '+7 (900) 123-45-67',
        'г. Москва, ул. Примерная, д. 10, кв. 25'
    ]);
    
    echo "✅ Тестовый пользователь добавлен<br>";
    echo "<p><strong>Тестовые данные для входа:</strong></p>";
    echo "<ul>";
    echo "<li>Email: test@example.com</li>";
    echo "<li>Пароль: password123</li>";
    echo "</ul>";
    
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-top: 20px;'>";
    echo "<h3>✅ Настройка завершена успешно!</h3>";
    echo "<p>Теперь вы можете <a href='../html/login.html' style='color: #155724; text-decoration: underline;'>войти в систему</a></p>";
    echo "</div>";
    
} catch (PDOException $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>";
    echo "<h3>❌ Ошибка при настройке базы данных</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "<p><strong>Возможные причины:</strong></p>";
        echo "<ul>";
        echo "<li>Неверный пароль MySQL. Для OpenServer попробуйте пароль 'root'</li>";
        echo "<li>MySQL сервер не запущен</li>";
        echo "</ul>";
        echo "<p>Запустите OpenServer и убедитесь, что MySQL работает</p>";
    }
    echo "</div>";
}
?>