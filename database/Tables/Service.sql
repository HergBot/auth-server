CREATE TABLE Service
(
    Service_Id BINARY(16) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Service_Id)
);