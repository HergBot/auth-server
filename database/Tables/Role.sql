CREATE TABLE Role
(
    Role_Id BINARY(16) NOT NULL,
    Service_Id BINARY(16) NOT NULL,
    Name VARCHAR(100),
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Role_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
);