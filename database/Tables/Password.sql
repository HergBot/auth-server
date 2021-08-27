CREATE TABLE Password
(
    Password_Id INT NOT NULL AUTO_INCREMENT,
    User_Id INT NOT NULL,
    Password_Hash VARCHAR(128) NOT NULL,
    Salt VARCHAR(16) NOT NULL,
    Version VARCHAR(8) NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Password_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id)
);
