create database if not exists facebook;
use facebook;

create user 'user'@'%' identified by '123';
grant all privileges on facebook.* to 'user'@'%' with grant option;

-- Users
create table if not exists users (
	id int primary key AUTO_INCREMENT,
    username varchar(32) unique not null,
    password varchar(64) unique not null,
    email VARCHAR(64) UNIQUE NOT NULL,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
	address VARCHAR(64),
    city VARCHAR(32),
    state VARCHAR(32),
    phone_number VARCHAR(16),
    date_of_birth DATE,
    created_at timestamp default current_timestamp,
    role ENUM('admin','user') default 'user',
    is_blocked boolean default false
);

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- admin 
insert into users (username,password,email,first_name,last_name,address,city,state,phone_number,date_of_birth,role)
values ('admin','123','admin@example.com','Admin','Admin','White House','Washington DC','Washington', '000111111','2000-01-01','admin');

-- users
insert into users (username,password,email,first_name,last_name,address,city,state,phone_number,date_of_birth)
values ('john_doe', 'password123', 'john.doe@example.com', 'John', 'Doe', '123 Elm St', 'Springfield', 'Illinois', '555123456', '1995-05-15'),
('jane_smith', 'securepass', 'jane.smith@example.com', 'Jane', 'Smith', '456 Oak Rd', 'Greenville', 'South Carolina', '555987654', '1992-11-20'),
('alice_williams', 'alicepass', 'alice.williams@example.com', 'Alice', 'Williams', '789 Pine Blvd', 'Lakewood', 'Colorado', '555654321', '1989-08-10');

insert into friendships (user_id,friend_id, status) values
(2,3,'pending'),
(3,2,'accepted');

insert into posts (user_id,content,image_url, status) values
(2,'Donald Trump is the new 47th president of USA!',NULL,'approved'),
(3, 'Any book suggestions?',NULL,'pending');











