CREATE TABLE Role
(
    Role_Id INT NOT NULL AUTO_INCREMENT,
    Service_Id INT NOT NULL,
    Name VARCHAR(100),
    PRIMARY KEY (Role_Id),
    FOREIGN KEY (Service_Id) REFERENCES Service(Service_Id)
);
