CREATE TABLE ServiceToken
(
    Service_Token_Id BINARY(16) NOT NULL,
    Service_Id BINARY(16) NOT NULL,
    Description VARCHAR(50) NOT NULL,
    Created DATETIME NOT NULL,
    Expires DATETIME DEFAULT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Service_Token_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
);