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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_login TINYINT DEFAULT 1
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
INSERT INTO friendship (user_id, friend_id, status) 
VALUES 
(2, 3, 'pending'),   -- Bojana šalje zahtev Marku
(3, 2, 'accepted'),  -- Marko prihvata zahtev Bojane
(1, 2, 'accepted'),
(1, 3, 'pending'),
(2, 1, 'accepted'),
(2, 4, 'accepted'),
(3, 1, 'pending'),
(3, 5, 'accepted'),
(4, 2, 'accepted'),
(4, 6, 'pending'),
(5, 3, 'accepted'),
(5, 7, 'accepted'),
(6, 4, 'pending'),
(6, 8, 'accepted'),
(7, 5, 'accepted'),
(7, 9, 'accepted'),
(8, 6, 'accepted'),
(8, 10, 'pending'),
(9, 7, 'accepted'),
(9, 8, 'pending'),
(10, 9, 'accepted'),
(10, 8, 'pending');

-- Dodavanje objava
INSERT INTO post (user_id, content, image, status) 
VALUES 
(2, 'Lep dan za šetnju!', NULL, 'approved'), 
(3, 'Uzivam u novoj knjizi.', NULL, 'pending'),
(1, 'Ovo je moj prvi post. Dobrodošli na moj profil!', NULL, 'approved'),
(2, 'Lepo je biti ovde. Nadam se da ćemo se dobro zabavljati!', NULL, 'approved'),
(3, 'Danas sam otišao na planinarenje. Bilo je prelepo!', NULL, 'approved'),
(4, 'Volim da čitam knjige o ličnom razvoju. Koje vi čitate?', NULL, 'approved'),
(5, 'Proveo sam vikend u prirodi, opuštanje je bilo savršeno!', NULL, 'approved'),
(6, 'Novi projekat na poslu, radim na nečemu super!', NULL, 'approved'),
(7, 'Proleće je stiglo, vreme je za uživanje na suncu!', NULL, 'approved'),
(8, 'Učim da sviram gitaru, napredak je fenomenalan!', NULL, 'approved'),
(9, 'Bavio sam se sportom cele nedelje, sada se osećam odlično!', NULL, 'approved'),
(10, 'Večeras imam planove sa prijateljima, radujem se!', NULL, 'approved'),
(1, 'Proveo sam dan u parku, bilo je prelepo vreme!', NULL, 'approved'),
(2, 'Danas sam pripremao omiljeni recept, miris je bio fantastičan!', NULL, 'approved'),
(3, 'Voleo bih da idem na more ovog leta, neko ima preporuke?', NULL, 'approved'),
(4, 'Uživam u šetnji po gradu, svuda su prelepe boje!', NULL, 'approved'),
(5, 'Sutra idem na planirano putovanje u inostranstvo, radujem se!', NULL, 'approved'),
(6, 'Danas sam završio važan projekat na poslu, osećam se sjajno!', NULL, 'approved'),
(7, 'Nedeljni odmor, vreme za puni opuštaj!', NULL, 'approved'),
(8, 'Naučio sam nove akorde na gitari, sada sviram omiljenu pesmu!', NULL, 'approved'),
(9, 'Počeo sam da trčim, prvi put nakon duže pauze!', NULL, 'approved'),
(10, 'Proveo sam vikend sa porodicom, prelepo vreme!', NULL, 'approved');
