DROP SCHEMA IF EXISTS heroku_56b9a13d37e5dfb;
CREATE SCHEMA heroku_56b9a13d37e5dfb;
USE heroku_56b9a13d37e5dfb;

CREATE TABLE Users (
	id INT(32) NOT NULL AUTO_INCREMENT,
	firstName varchar(255) NOT NULL,
	lastName varchar(255) NOT NULL,
	username varchar(255) UNIQUE,
	password varchar(255) NOT NULL,
	googleID varchar(255),
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

CREATE TABLE Statistics (
  id INT(32) NOT NULL AUTO_INCREMENT,
	landingPage varchar(255) NOT NULL,
	landingTime TIME NOT NULL,
	landingDate DATE NOT NULL,
	browser varchar(255) NOT NULL,
	os varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_userIdFrom FOREIGN KEY (idFrom) REFERENCES Users(id);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_userIdTo FOREIGN KEY (idTo) REFERENCES Users(id);

ALTER TABLE Payments ADD CONSTRAINT Payments_fk_eventId FOREIGN KEY (eventId) REFERENCES Events(id);

ALTER TABLE Friends ADD CONSTRAINT Friends_fk_userId1 FOREIGN KEY (id1) REFERENCES Users(id);

ALTER TABLE Friends ADD CONSTRAINT Friends_fk_userId2 FOREIGN KEY (id2) REFERENCES Users(id);

ALTER TABLE Events ADD CONSTRAINT Events_fk_creatorId FOREIGN KEY (creatorId) REFERENCES Users(id);


CREATE PROCEDURE sp_new_user(IN a_firstName varchar(255), IN a_lastName varchar(255), IN a_email varchar(255),
                            IN a_username varchar(255), IN a_password varchar(255), IN a_googleID varchar(255))
    BEGIN
    INSERT INTO Users(firstName, lastName, username, password, email, googleID)
        VALUES (a_firstName, a_lastName, a_username, a_password, a_email, a_googleID);
    SELECT * FROM Users WHERE googleID = a_googleID;
    END;

CREATE PROCEDURE sp_add_friend(IN uid INT(32), IN fid INT(32))
    BEGIN
    INSERT INTO Friends(id1, id2, confirmed) VALUES (uid, fid, 0);
    END;

CREATE PROCEDURE sp_changeFriendRequestStatus(IN uid INT(32), IN fid INT(32), IN status INT(2))
    BEGIN
    UPDATE friends SET confirmed=status WHERE id2=uid AND id1=fid;
    END;

CREATE PROCEDURE sp_addEvent(IN a_title varchar(255), IN descriptionIn varchar(255), IN a_creatorId INT(32))
    BEGIN
    INSERT INTO events(title, description, creatorId) VALUES (a_title, descriptionIn, a_creatorId);
    END;

CREATE PROCEDURE sp_addPayment(IN uid INT(32), IN fromusername varchar(255), IN amountIn FLOAT(32), IN a_eventid INT(32))
    BEGIN
    DECLARE a_idFrom INT(32);
    SELECT id INTO a_idFrom FROM v_users, v_friends WHERE username=fromusername AND ((id1=uid AND id2=id) OR
    (id2=uid AND id1=id)) AND confirmed=1;
    INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (a_idFrom, uid, amountIn, 0, a_eventid);
    END;

CREATE PROCEDURE sp_changePaymentStatus(IN uid INT(32), IN status INT(2))
    BEGIN
    UPDATE payments SET confirmed=status WHERE id=uid;
    END;

CREATE PROCEDURE sp_addStatistics(IN a_landingPage varchar(255), IN a_landingTime TIME,
 IN a_landingDate DATE, IN a_browser varchar(255), IN a_os varchar(255))
BEGIN
INSERT INTO Statistics(landingPage, landingTime, landingDate, browser, os)
VALUES (a_landingPage, a_landingTime, a_landingDate, a_browser, a_os);
END;

CREATE VIEW v_users AS
  SELECT * FROM users;

CREATE VIEW v_friends AS
  SELECT * FROM friends;

CREATE VIEW v_events AS
  SELECT * FROM events;

CREATE VIEW v_payments AS
  SELECT * FROM payments;

CREATE VIEW v_statistics AS
  SELECT * FROM Statistics;

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

-- INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Kaspar", "Valk", "a@a", "Mikimer177", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
-- INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Kari", "Kakk", "b@a", "kakukas", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
-- INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Mari", "Murakas", "c@a", "H3RO", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
-- INSERT INTO users (firstName, lastName, email, username, password) VALUES ("Miki", "Hiir", "ab@a", "Lurr", "$2a$10$LpXu5oXrKHnvT5TfPqzAXOwQa2RnjjjO0//bP58v6WVlVZx8tWIRS");
-- INSERT INTO friends (id1, id2, confirmed) VALUES (21,1,0);
-- INSERT INTO friends (id1, id2, confirmed) VALUES (31,1,1);
--
-- INSERT INTO events(title, description, creatorId) VALUES ("Taksosõit", "koolist koju", 31);
-- INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (1, 31, 10, 0, 1);
-- INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (21, 31, 10, 0, 1);
--
-- INSERT INTO events(title, description, creatorId) VALUES ("pitsakas", "kolmap pitsa", 1);
-- INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (31, 1, 5, 0, 11);
-- INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (21, 1, 10, 0, 11);
--
-- INSERT INTO events(title, description, creatorId) VALUES ("söömas", "teisip supp", 1);
-- INSERT INTO payments(idFrom, idTo, amount, confirmed, eventId) VALUES (31, 1, 5, 0, 21);
--
-- INSERT INTO events(title, description, creatorId) VALUES ("test", "test", 1);
-- INSERT INTO events(title, description, creatorId) VALUES ("test2", "test2", 1);


/*
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
*/
