CREATE TABLE UserRole
(
    User_Id BINARY(16) NOT NULL,
    Role_Id BINARY(16) NOT NULL,
    PRIMARY KEY (User_Id, Role_Id),
    FOREIGN KEY (User_Id) REFERENCES User(User_Id),
    FOREIGN KEY (Role_Id) REFERENCES Role(Role_Id)
);
