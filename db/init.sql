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