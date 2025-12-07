-- Создание базы данных
CREATE DATABASE IF NOT EXISTS medclinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medclinic;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица записей на прием
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    symptoms TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица медицинских записей
CREATE TABLE IF NOT EXISTS medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    visit_date DATE NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    diagnosis TEXT NOT NULL,
    recommendations TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица рецептов
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Вставка тестовых данных
INSERT INTO users (email, password, full_name, birth_date, phone, address) VALUES
('patient@example.com', '$2y$10$YourHashedPasswordHere', 'Иванов Иван Иванович', '1985-05-15', '+7 (900) 123-45-67', 'г. Москва, ул. Примерная, д. 10, кв. 25');

INSERT INTO appointments (user_id, doctor_name, specialization, appointment_date, appointment_time, symptoms, status) VALUES
(1, 'Петрова Елена Сергеевна', 'Терапевт', '2023-06-15', '10:30:00', 'Повышенное давление', 'confirmed'),
(1, 'Сидоров Алексей Владимирович', 'Кардиолог', '2023-06-25', '14:00:00', 'Консультация', 'pending');

INSERT INTO medical_records (user_id, visit_date, doctor_name, diagnosis, recommendations) VALUES
(1, '2023-05-01', 'Петрова Елена Сергеевна', 'Острая респираторная инфекция', 'Постельный режим, обильное питье'),
(1, '2023-04-15', 'Сидоров Алексей Владимирович', 'Артериальная гипертензия', 'Контроль давления, ограничение соли');

INSERT INTO prescriptions (user_id, medicine_name, dosage, doctor_name, issue_date, expiry_date, status) VALUES
(1, 'Лозап', '50 мг, 1 раз в день', 'Сидоров Алексей Владимирович', '2023-04-15', '2023-07-15', 'active'),
(1, 'Аспирин Кардио', '100 мг, 1 раз в день', 'Сидоров Алексей Владимирович', '2023-04-15', '2023-07-15', 'active');