<?php
// config/database.php
class Database {
    private $host = "127.0.1.27"; // IP из вашего OSPanel
    private $port = "3306";
    private $db_name = "medclient";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        try {
            // Пробуем подключиться к серверу
            $temp_conn = new PDO(
                "mysql:host={$this->host};port={$this->port};charset=utf8mb4",
                $this->username,
                $this->password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            
            // Создаем базу если не существует
            $this->createDatabase($temp_conn);
            
            // Подключаемся к конкретной базе
            $this->conn = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            
            return $this->conn;
            
        } catch(PDOException $e) {
            // Логируем ошибку
            error_log("Database connection error: " . $e->getMessage());
            return null;
        }
    }
    
    private function createDatabase($connection) {
        try {
            $stmt = $connection->query("SHOW DATABASES LIKE '{$this->db_name}'");
            if ($stmt->rowCount() == 0) {
                $connection->exec("CREATE DATABASE `{$this->db_name}` 
                    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            }
            
            // Переключаемся на базу
            $connection->exec("USE `{$this->db_name}`");
            
            // Создаем таблицы
            $this->createTables($connection);
            
        } catch(PDOException $e) {
            error_log("Database creation error: " . $e->getMessage());
            throw $e;
        }
    }
    
    private function createTables($connection) {
        $tables = [
            "users" => "CREATE TABLE IF NOT EXISTS `users` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `email` VARCHAR(100) UNIQUE NOT NULL,
                `password` VARCHAR(255) NOT NULL,
                `full_name` VARCHAR(100) NOT NULL,
                `birth_date` DATE,
                `phone` VARCHAR(20),
                `address` TEXT,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci",
            
            "doctors" => "CREATE TABLE IF NOT EXISTS `doctors` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `full_name` VARCHAR(100) NOT NULL,
                `specialization` VARCHAR(100) NOT NULL,
                `experience_years` INT,
                `phone` VARCHAR(20),
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];
        
        foreach ($tables as $table_name => $sql) {
            try {
                $connection->exec($sql);
            } catch (PDOException $e) {
                // Пропускаем ошибки "таблица уже существует"
                if (strpos($e->getMessage(), 'already exists') === false) {
                    error_log("Table creation error ({$table_name}): " . $e->getMessage());
                }
            }
        }
        
        // Добавляем тестовых врачей
        $this->seedDoctors($connection);
    }
    
    private function seedDoctors($connection) {
        try {
            $stmt = $connection->query("SELECT COUNT(*) as count FROM `doctors`");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['count'] == 0) {
                $doctors = [
                    ['Петрова Елена Сергеевна', 'Терапевт', 15, '+7 (495) 123-45-67'],
                    ['Сидоров Алексей Владимирович', 'Кардиолог', 12, '+7 (495) 234-56-78'],
                    ['Козлова Мария Ивановна', 'Невролог', 8, '+7 (495) 345-67-89']
                ];
                
                $insertStmt = $connection->prepare(
                    "INSERT INTO `doctors` (full_name, specialization, experience_years, phone) 
                     VALUES (?, ?, ?, ?)"
                );
                
                foreach ($doctors as $doctor) {
                    $insertStmt->execute($doctor);
                }
            }
        } catch (PDOException $e) {
            error_log("Doctors seeding error: " . $e->getMessage());
        }
    }
}
?>