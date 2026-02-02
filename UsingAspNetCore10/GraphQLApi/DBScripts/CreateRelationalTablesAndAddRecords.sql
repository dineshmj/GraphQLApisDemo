USE GraphQLTrainingDb;
GO

-- ==================================================================================
--         DROP TABLES IF THEY EXIST
-- ==================================================================================

IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NOT NULL
    DROP TABLE dbo.OrderItems;
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL
    DROP TABLE dbo.Orders;
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NOT NULL
    DROP TABLE dbo.Products;
GO

IF OBJECT_ID(N'dbo.Categories', N'U') IS NOT NULL
    DROP TABLE dbo.Categories;
GO

-- ==================================================================================
--         CREATE RELATIONAL TABLES
-- ==================================================================================
CREATE TABLE Categories (
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL
);

CREATE TABLE Products (
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    CategoryId INT NOT NULL
        FOREIGN KEY REFERENCES Categories(Id)
);

CREATE TABLE Orders (
    Id INT IDENTITY PRIMARY KEY,
    CustomerName NVARCHAR(200) NOT NULL
);

CREATE TABLE OrderItems (
    Id INT IDENTITY PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id),
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id),
    Quantity INT NOT NULL
);

-- ==================================================================================
--         INSERT RECORDS INTO RELATIONAL TABLES
-- ==================================================================================

IF NOT EXISTS (SELECT 1 FROM Categories)
BEGIN
    INSERT INTO Categories (Name)
    VALUES ('Stationery'),
           ('Electronics'),
           ('Groceries'),
           ('Books');
END
GO

IF NOT EXISTS (SELECT 1 FROM Products)
BEGIN
    INSERT INTO Products (Name, Price, CategoryId)
    VALUES
        ('Gel Pen', 10.00, (SELECT Id FROM Categories WHERE Name='Stationery')),
        ('Notebook', 45.00, (SELECT Id FROM Categories WHERE Name='Stationery')),
        ('Wireless Mouse', 599.00, (SELECT Id FROM Categories WHERE Name='Electronics')),
        ('USB Keyboard', 799.00, (SELECT Id FROM Categories WHERE Name='Electronics')),
        ('Organic Rice 1kg', 89.00, (SELECT Id FROM Categories WHERE Name='Groceries')),
        ('Olive Oil 500ml', 349.00, (SELECT Id FROM Categories WHERE Name='Groceries')),
        ('C# in Depth (Book)', 1150.00, (SELECT Id FROM Categories WHERE Name='Books')),
        ('Clean Code (Book)', 980.00, (SELECT Id FROM Categories WHERE Name='Books'));
END
GO

IF NOT EXISTS (SELECT 1 FROM Orders)
BEGIN
    INSERT INTO Orders (CustomerName)
    VALUES ('Alice Johnson'),
           ('Dinesh Kumar'),
           ('Emily Carter');
END
GO

IF NOT EXISTS (SELECT 1 FROM OrderItems)
BEGIN
    INSERT INTO OrderItems (OrderId, ProductId, Quantity)
    VALUES
        -- Order 1 (Alice)
        ((SELECT Id FROM Orders WHERE CustomerName='Alice Johnson'),
            (SELECT Id FROM Products WHERE Name='Gel Pen'), 3),
        ((SELECT Id FROM Orders WHERE CustomerName='Alice Johnson'),
            (SELECT Id FROM Products WHERE Name='Notebook'), 1),

        -- Order 2 (Dinesh)
        ((SELECT Id FROM Orders WHERE CustomerName='Dinesh Kumar'),
            (SELECT Id FROM Products WHERE Name='Wireless Mouse'), 1),
        ((SELECT Id FROM Orders WHERE CustomerName='Dinesh Kumar'),
            (SELECT Id FROM Products WHERE Name='USB Keyboard'), 1),

        -- Order 3 (Emily)
        ((SELECT Id FROM Orders WHERE CustomerName='Emily Carter'),
            (SELECT Id FROM Products WHERE Name='Organic Rice 1kg'), 2),
        ((SELECT Id FROM Orders WHERE CustomerName='Emily Carter'),
            (SELECT Id FROM Products WHERE Name='Clean Code (Book)'), 1);
END
GO