CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'ftn123';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'ftn123';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS social_network;
USE social_network;

-- Tabela za korisnike
CREATE TABLE IF NOT EXISTS user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    address VARCHAR(64),
    city VARCHAR(32),
    state VARCHAR(32),
    phone_number VARCHAR(16),
    is_admin TINYINT DEFAULT 0,
    is_blocked TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela za prijateljstva između korisnika
CREATE TABLE IF NOT EXISTS friendship (
    friendship_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (friend_id) REFERENCES user(user_id)
);

-- Tabela za objave
CREATE TABLE IF NOT EXISTS post (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    image MEDIUMBLOB, -- can store up to 16MB of data
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);



-- Tabela za administrativno praćenje odbijenih objava i blokiranih korisnika
CREATE TABLE IF NOT EXISTS rejection_log (
    rejection_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    rejection_count INT DEFAULT 1,
    is_blocked TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

-- Dodavanje administratora
INSERT INTO user (username, email, password, first_name, last_name, address, city, state, phone_number, is_admin) 
VALUES 
('admin', 'admin@example.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin', 'Adminovic', 'Bulevar Evrope 24', 'Novi Sad', 'Srbija', '123456789', 1);
-- lozinka za admina je admin123

-- Dodavanje običnih korisnika
INSERT INTO user (username, email, password, first_name, last_name, address, city, state, phone_number) 
VALUES 
('bojana123', 'bojana123@gmail.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Bojana', 'Mihajlovic', 'Marsala Tita 124', 'Lajkovac', 'Srbija', '123123123'),
('marko_m', 'marko@gmail.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Marko', 'Markovic', 'Nemanjina 45', 'Beograd', 'Srbija', '987654321');
--lozinka za ostale je lozinka123

-- Dodavanje prijateljskih zahteva
INSERT INTO friendship (user_id, friend_id, status) 
VALUES 
(2, 3, 'pending'),   -- Bojana šalje zahtev Marku
(3, 2, 'accepted');  -- Marko prihvata zahtev Bojane

-- Dodavanje objava
INSERT INTO post (user_id, content, image_url, status) 
VALUES 
(2, 'Lep dan za šetnju!', NULL, 'approved'), 
(3, 'Uzivam u novoj knjizi.', NULL, 'pending');
