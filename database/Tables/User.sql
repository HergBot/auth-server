CREATE TABLE User
(
    User_Id BINARY(16) NOT NULL,
    Service_Id BINARY(16) NOT NULL,
    Username VARCHAR(64) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (User_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
);
