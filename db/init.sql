DROP DATABASE IF EXISTS biller;

CREATE DATABASE biller;

CREATE TABLE `users` (
  "id" int(5) AUTO_INCREMENT PRIMARY KEY,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "username" varchar(20) NOT NULL,
  "password" varchar(255) NOT NULL
)