CREATE TABLE Session
(
    Session_Id BINARY(16) NOT NULL,
    User_Id BINARY(16) NOT NULL,
    Refresh_Token BINARY(16) NOT NULL,
    Expires DATETIME NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Session_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id)
);
