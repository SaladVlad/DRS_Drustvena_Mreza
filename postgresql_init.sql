-- Create user and grant privileges
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user'
   ) THEN
      CREATE ROLE "user" LOGIN PASSWORD 'ftn123';
   END IF;
END $$;

-- Grant privileges (assuming database already exists)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";

-- Create the database
CREATE DATABASE social_network;
\c social_network -- Connect to the database

-- Table for users
CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    address VARCHAR(64),
    city VARCHAR(32),
    state VARCHAR(32),
    phone_number VARCHAR(16),
    is_admin BOOLEAN DEFAULT FALSE,
    times_rejected INT DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_login BOOLEAN DEFAULT TRUE
);

-- Table for friendships
CREATE TABLE IF NOT EXISTS friendship (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    initiator_id INT NOT NULL,
    status VARCHAR(10) CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES "user" (user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES "user" (user_id) ON DELETE CASCADE,
    CONSTRAINT user_id_less_than_friend_id CHECK (user_id < friend_id)
);

-- Table for posts
CREATE TABLE IF NOT EXISTS post (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    image_name VARCHAR(50),
    image_type VARCHAR(50),
    image_data BYTEA,
    status VARCHAR(10) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);

-- Insert admin user
INSERT INTO "user" (username, email, password, first_name, last_name, address, city, state, phone_number, is_admin) 
VALUES 
('admin', 'admin@example.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin', 'Adminovic', 'Bulevar Evrope 24', 'Novi Sad', 'Srbija', '123456789', TRUE);

-- Insert regular users
INSERT INTO "user" (username, email, password, first_name, last_name, address, city, state, phone_number) 
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

-- Insert friendship requests
INSERT INTO friendship (user_id, friend_id, initiator_id, status, created_at) 
VALUES 
(2, 3, 2, 'pending', CURRENT_TIMESTAMP),
(1, 2, 1, 'accepted', CURRENT_TIMESTAMP),
(2, 4, 2, 'accepted', CURRENT_TIMESTAMP),
(3, 5, 3, 'accepted', CURRENT_TIMESTAMP),
(4, 6, 4, 'pending', CURRENT_TIMESTAMP),
(5, 7, 5, 'accepted', CURRENT_TIMESTAMP),
(6, 8, 6, 'accepted', CURRENT_TIMESTAMP),
(7, 9, 9, 'accepted', CURRENT_TIMESTAMP),
(8, 10, 8, 'pending', CURRENT_TIMESTAMP);

-- Insert posts
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
(10, 'Rainy days make for the best cozy vibes.', NULL, NULL, NULL, 'approved');
