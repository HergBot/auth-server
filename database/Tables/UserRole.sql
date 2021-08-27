CREATE TABLE UserRole
(
    User_Id INT NOT NULL,
    Role_Id INT NOT NULL,
    PRIMARY KEY (User_Id, Role_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id),
    FOREIGN KEY (Role_Id) REFERENCES Role(Role_Id)
);
