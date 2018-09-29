DROP SCHEMA IF EXISTS heroku_56b9a13d37e5dfb;
CREATE SCHEMA heroku_56b9a13d37e5dfb;
USE heroku_56b9a13d37e5dfb;

CREATE TABLE Users (
	id INT(32) NOT NULL AUTO_INCREMENT,
	firstName varchar(255) NOT NULL,
	lastName varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (id)
);

CREATE TABLE Payments (
	id INT(32) NOT NULL AUTO_INCREMENT,
	idFrom INT(32) NOT NULL,
	idTo INT(32) NOT NULL,
	amount FLOAT(32) NOT NULL,
	confirmed INT(2) NOT NULL,
	eventId INT(32) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Events (
	id INT(32) NOT NULL AUTO_INCREMENT,
	creatorId INT(32) NOT NULL,
	title varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	pictureId INT(32),
	PRIMARY KEY (id)
);

CREATE TABLE Friends (
	id1 INT(32) NOT NULL,
	id2 INT(32) NOT NULL,
	confirmed INT(2) NOT NULL,
	PRIMARY KEY (id1,id2)
);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_userIdFrom FOREIGN KEY (idFrom) REFERENCES Users(id);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_userIdTo FOREIGN KEY (idTo) REFERENCES Users(id);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_eventId FOREIGN KEY (eventId) REFERENCES Events(id);

ALTER TABLE Friends ADD CONSTRAINT Friends_fk_userId1 FOREIGN KEY (id1) REFERENCES Users(id);

ALTER TABLE Friends ADD CONSTRAINT Friends_fk_userId2 FOREIGN KEY (id2) REFERENCES Users(id);

ALTER TABLE Events ADD CONSTRAINT Events_fk_creatorId FOREIGN KEY (creatorId) REFERENCES Users(id);


CREATE PROCEDURE sp_new_user(IN a_firstName varchar(255), IN a_lastName varchar(255), IN a_email varchar(255),
                            IN a_username varchar(255), IN a_password varchar(255))
    BEGIN
    INSERT INTO Users(firstName, lastName, username, password, email)
        VALUES (a_firstName, a_lastName, a_username, a_password, a_email);
    END;

-- Tegin selle vaate, et oleks lihtsam luua vaadet v_payments_and_names
CREATE VIEW v_payments_and_payers AS
  SELECT  idFrom, idTo, amount, confirmed, eventId, payments.id as paymentId, firstName as payerFName, lastName as payerLName FROM Users, Payments
   WHERE idFrom=users.id;

-- Paymentide vaade, kus on ka osalejate nimed
CREATE VIEW v_payments_and_names AS
  SELECT idFrom, idTo, amount, confirmed, eventId, payerFName, payerLName, firstName as receiverFName, lastName as receiverLName, paymentId
  FROM v_payments_and_payers, users
  WHERE idTo=users.id;

CREATE VIEW v_events_and_payments AS
  SELECT  idFrom, idTo, amount, confirmed, eventId, description, pictureId, creatorId, title, payerFName, payerLName, paymentId,
   receiverFName, receiverLName
   FROM Events, v_payments_and_names
   WHERE eventId=Events.id;

INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Kaspar", "Valk", "a@a", "Mikimer177", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Kari", "Kakk", "b@a", "kakukas", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Mari", "Murakas", "c@a", "H3RO", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Miki", "Hiir", "ab@a", "Lurr", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
INSERT INTO friends (id1, id2, confirmed) VALUES (2,1,0);
INSERT INTO friends (id1, id2, confirmed) VALUES (3,1,1);

INSERT INTO events(title, description, creatorId) VALUES ("Taksosõit", "koolist koju", 3);
INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (1, 3, 10, 0, 1);
INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (2, 3, 10, 0, 1);

INSERT INTO events(title, description, creatorId) VALUES ("pitsakas", "kolmap pitsa", 1);
INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (3, 1, 5, 0, 2);
INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (2, 1, 10, 0, 2);

INSERT INTO events(title, description, creatorId) VALUES ("söömas", "teisip supp", 1);
INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (3, 1, 5, 0, 3);

INSERT INTO events(title, description, creatorId) VALUES ("test", "test", 1);
INSERT INTO events(title, description, creatorId) VALUES ("test2", "test2", 1);
