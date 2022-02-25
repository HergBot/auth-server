CREATE TABLE Session
(
    Session_Id VARCHAR(32) NOT NULL,
    User_Id INT NOT NULL,
    Refresh_Token VARCHAR(32) NOT NULL,
    Expires DATETIME NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Session_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id)
);

CREATE TRIGGER Before_Insert_Session
    BEFORE INSERT ON Session
    FOR EACH ROW
    SET new.Session_Id = UUID();
