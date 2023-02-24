CREATE TABLE Password
(
    Password_Id BINARY(16) NOT NULL,
    User_Id BINARY(16) NOT NULL,
    Password_Hash VARCHAR(128) NOT NULL,
    Salt VARCHAR(16) NOT NULL,
    Version VARCHAR(8) NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Password_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id)
);