<?php
echo "<h2>Тест исправления для OSPanel 6.4.6</h2>";

// Пробуем подключиться к разным адресам
$hosts = ['127.0.1.27', '127.0.1.28', '127.0.0.1', 'localhost'];
$port = 3306;
$username = 'root';
$password = '';

foreach ($hosts as $host) {
    echo "<h3>Проверка подключения к: <code>{$host}:{$port}</code></h3>";
    
    try {
        $pdo = new PDO(
            "mysql:host={$host};port={$port};charset=utf8mb4",
            $username,
            $password
        );
        
        echo "<div style='color: green;'>✅ Успешное подключение!</div>";
        
        // Проверяем базы данных
        $databases = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
        echo "<div>Доступные базы данных: " . implode(', ', $databases) . "</div>";
        
        // Создаем нашу базу если её нет
        if (!in_array('medclient', $databases)) {
            $pdo->exec("CREATE DATABASE medclient CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "<div>✅ База 'medclient' создана</div>";
        } else {
            echo "<div>✅ База 'medclient' уже существует</div>";
        }
        
        // Подключаемся к базе
        $pdo->exec("USE medclient");
        
        echo "<div>✅ Подключение к базе 'medclient' успешно</div>";
        
        // Создаем простую тестовую таблицу
        $pdo->exec("CREATE TABLE IF NOT EXISTS test_connection (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(100))");
        echo "<div>✅ Тестовая таблица создана</div>";
        
        // Вставляем тестовую запись
        $stmt = $pdo->prepare("INSERT INTO test_connection (message) VALUES (?)");
        $stmt->execute(["Тест из " . $host]);
        echo "<div>✅ Тестовая запись добавлена (ID: " . $pdo->lastInsertId() . ")</div>";
        
        break; // Останавливаемся при первом успешном подключении
        
    } catch (PDOException $e) {
        echo "<div style='color: red;'>❌ Ошибка: " . $e->getMessage() . "</div>";
    }
}

echo "<h3>Инструкция:</h3>";
echo "<p>1. Используйте рабочий хост из списка выше</p>";
echo "<p>2. Обновите <code>config/database.php</code> с этим хостом</p>";
echo "<p>3. Откройте <a href='index.php'>главную страницу</a></p>";

// Сохраняем рабочий хост в файл
echo "<script>
// Автоматически определяем и сохраняем рабочий хост
document.addEventListener('DOMContentLoaded', function() {
    const successDiv = document.querySelector('div[style*=\"color: green\"]');
    if (successDiv) {
        const text = successDiv.textContent;
        const match = text.match(/к:\s*([^<]+)/);
        if (match) {
            const host = match[1].replace('<code>', '').replace('</code>', '').trim();
            console.log('Рабочий хост:', host);
            
            // Можно отправить на сервер или показать пользователю
            document.getElementById('result').innerHTML = 
                '<h4>Рекомендуемый хост: ' + host + '</h4>' +
                '<p>Используйте этот адрес в config/database.php</p>';
        }
    }
});
</script>";

echo "<div id='result'></div>";
?>