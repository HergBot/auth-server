CREATE TABLE Role
(
    Role_Id INT NOT NULL AUTO_INCREMENT,
    Server_Id INT NOT NULL,
    Name VARCHAR(100),
    PRIMARY KEY (Role_Id),
    FOREIGN KEY (Server_Id) REFERENCES Server(Server_Id)
);
