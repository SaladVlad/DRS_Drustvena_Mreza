SHOW WARNINGS;

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
    times_rejected INT DEFAULT 0,
    is_blocked TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_login TINYINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS friendship (
    user_id INT NOT NULL,  -- Id korisnika
    friend_id INT NOT NULL,  -- Id sa kojima je taj korisnik prijatelj (uvek ce biti vise od user_id)
    initiator_id INT NOT NULL,  -- Onaj koji je inicijator zahteva (kako bi se znalo ko moze da prihvati zahtev)
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES user(user_id) ON DELETE CASCADE,
    CHECK (user_id < friend_id) -- Provera da je user_id1 manji od user_id2
);

-- Tabela za objave
CREATE TABLE IF NOT EXISTS post (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    image_name VARCHAR(50),
    image_type VARCHAR(50),
    image_data MEDIUMBLOB, -- can store up to 16MB of data
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
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
('marko_m', 'marko@gmail.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Marko', 'Markovic', 'Nemanjina 45', 'Beograd', 'Srbija', '987654321'),
('jovan123', 'jovan123@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Jovan', 'Ivić', '123 Glavna Ulica', 'Beograd', 'Serbia', '0631234567'),
('maria456', 'maria456@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Marija', 'Petrović', '456 Nova Ulica', 'Novi Sad', 'Serbia', '0642345678'),
('ivan789', 'ivan789@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Ivan', 'Jovanović', '789 Stara Ulica', 'Niš', 'Serbia', '0653456789'),
('anna321', 'anna321@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Ana', 'Kostić', '101 Sunčeva Ulica', 'Kragujevac', 'Serbia', '0664567890'),
('marko654', 'marko654@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Marko', 'Marković', '202 Drumska Ulica', 'Subotica', 'Serbia', '0675678901'),
('dragana987', 'dragana987@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Dragana', 'Stanković', '303 Zeleni Put', 'Kragujevac', 'Serbia', '0686789012'),
('petar135', 'petar135@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Petar', 'Nikolić', '404 Ulica 7. Jula', 'Zrenjanin', 'Serbia', '0697890123'),
('ivana246', 'ivana246@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Ivana', 'Đorđević', '505 Industrijska Ulica', 'Leskovac', 'Serbia', '0608901234'),
('nemanja369', 'nemanja369@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Nemanja', 'Lukić', '606 Park Ulica', 'Vranje', 'Serbia', '0619012345'),
('jelena258', 'jelena258@example.com', '8d43d8eb44484414d61a18659b443fbfe52399510da4689d5352bd9631c6c51b', 'Jelena', 'Savić', '707 Bulevar Oslobođenja', 'Čačak', 'Serbia', '0620123456');
-- lozinka za ostale je lozinka123

-- Dodavanje prijateljskih zahteva
-- Insert new data with initiator_id
INSERT INTO friendship (user_id, friend_id, initiator_id, status, created_at) 
VALUES 
(2, 3, 2, 'pending', CURRENT_TIMESTAMP),   -- Bojana šalje zahtev Marku
(1, 2, 1, 'accepted', CURRENT_TIMESTAMP),  -- Jovan je inicijator prijateljstva sa Bojanom
(2, 4, 2, 'accepted', CURRENT_TIMESTAMP),  -- Bojana inicirala sa Marijom
(3, 5, 3, 'accepted', CURRENT_TIMESTAMP),  -- Marko inicirao sa Ivanom
(4, 6, 4, 'pending', CURRENT_TIMESTAMP),   -- Marija šalje zahtev Ani
(5, 7, 5, 'accepted', CURRENT_TIMESTAMP),  -- Ivan inicirao sa drugim Markom
(6, 8, 6, 'accepted', CURRENT_TIMESTAMP),  -- Ana inicirala sa Draganom
(7, 9, 9, 'accepted', CURRENT_TIMESTAMP),  -- Petar inicirao sa Ivom
(8, 10, 8, 'pending', CURRENT_TIMESTAMP);  -- Dragana šalje zahtev Petru


-- Adding new posts with and without images
-- Adding new posts without images
INSERT INTO post (user_id, content, image_name, image_type, image_data, status)
VALUES
(1, 'Just finished reading a great book!', NULL, NULL, NULL, 'approved'),
(2, 'Exploring the mountains this weekend!', NULL, NULL, NULL, 'pending'),
(3, 'Had an amazing meal today, cooking is fun!', NULL, NULL, NULL, 'approved'),
(4, 'Sunset views are the best!', NULL, NULL, NULL, 'approved'),
(5, 'Feeling refreshed after a morning run!', NULL, NULL, NULL, 'approved'),
(6, 'Working on a new app design, exciting progress!', NULL, NULL, NULL, 'approved'),
(7, 'Weekend getaway to the countryside.', NULL, NULL, NULL, 'approved'),
(8, 'Practicing yoga daily, loving the results.', NULL, NULL, NULL, 'pending'),
(9, 'Tried painting today, sharing my first attempt.', NULL, NULL, NULL, 'approved'),
(10, 'Rainy days make for the best cozy vibes.', NULL, NULL, NULL, 'approved'),
(1, 'My garden is blooming, check out the flowers!', NULL, NULL, NULL, 'approved'),
(2, 'Camping trip memories from last year!', NULL, NULL, NULL, 'approved'),
(3, 'Visiting my favorite cafe again.', NULL, NULL, NULL, 'approved'),
(4, 'City lights look magical at night!', NULL, NULL, NULL, 'pending'),
(5, 'Learning to bake bread, a fun experience!', NULL, NULL, NULL, 'approved'),
(6, 'Exploring new trails on my bike.', NULL, NULL, NULL, 'approved'),
(7, 'Enjoying quality time with family this weekend.', NULL, NULL, NULL, 'approved'),
(8, 'Experimenting with landscape photography.', NULL, NULL, NULL, 'approved'),
(9, 'Building a birdhouse for my garden.', NULL, NULL, NULL, 'approved'),
(10, 'Spring cleaning complete, feels amazing!', NULL, NULL, NULL, 'approved');

COMMIT;