CREATE TABLE User
(
    User_Id INT NOT NULL AUTO_INCREMENT,
    Service_Id INT NOT NULL,
    Username VARCHAR(64) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    Created DATETIME NOT NULL,
    Deactivated DATETIME DEFAULT NULL,
    PRIMARY KEY (User_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
);
