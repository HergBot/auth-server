CREATE TABLE ServiceToken
(
    Service_Token_Id VARCHAR(36) NOT NULL,
    Service_Id INT NOT NULL,
    Description VARCHAR(50) NOT NULL,
    Created DATETIME NOT NULL,
    Expires DATETIME DEFAULT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (Service_Token_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
)