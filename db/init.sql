DROP SCHEMA IF EXISTS heroku_56b9a13d37e5dfb;
CREATE SCHEMA heroku_56b9a13d37e5dfb;
USE heroku_56b9a13d37e5dfb;

CREATE TABLE users(
  id int(5) AUTO_INCREMENT,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(20) NOT NULL,
  password varchar(255) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO users (first_name, last_name, email, username, password) VALUES ("a", "a", "a@a", "a", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
