create database Turf_Booking;
use Turf_Booking;

CREATE TABLE Admin (
    Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
    Admin_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(100) NOT NULL,
    Address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Turf_Owner (
    Owner_ID INT PRIMARY KEY AUTO_INCREMENT,
    Owner_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Turf (
    Turf_ID INT PRIMARY KEY AUTO_INCREMENT,
    Owner_ID INT NOT NULL,
    Turf_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Sport_Type VARCHAR(100) NOT NULL,
    Hourly_Rate VARCHAR(100) NOT NULL,
    Description TEXT,
    Is_Active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Owner_ID)
        REFERENCES Turf_Owner (Owner_ID)
);

CREATE TABLE Review (
    Review_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT NOT NULL,
    Turf_ID INT NOT NULL,
    Rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    Comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID)
        REFERENCES Customer (Customer_ID),
    FOREIGN KEY (Turf_ID)
        REFERENCES Turf (Turf_ID)
);
CREATE TABLE Booking (
    Booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT NOT NULL,
    Turf_ID INT NOT NULL,
    Booking_Date DATE NOT NULL,
    Start_Time TIME NOT NULL,
    End_Time TIME NOT NULL,
    Total_Amount DECIMAL(10 , 2 ) NOT NULL,
    Status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID)
        REFERENCES Customer (Customer_ID),
    FOREIGN KEY (Turf_ID)
        REFERENCES Turf (Turf_ID)
);

CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Booking_ID INT UNIQUE NOT NULL,
    Amount DECIMAL(10 , 2 ) NOT NULL,
    Payment_Method VARCHAR(100) NOT NULL,
    Payment_Status ENUM('pending', 'completed', 'refunded', 'failed') DEFAULT 'pending',
    Transaction_ID VARCHAR(100),
    Payment_Date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Booking_ID)
        REFERENCES Booking (Booking_ID)
);

CREATE TABLE Favorites (
    Customer_ID INT NOT NULL,
    Turf_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Customer_ID , Turf_ID),
    FOREIGN KEY (Customer_ID)
        REFERENCES Customer (Customer_ID),
    FOREIGN KEY (Turf_ID)
        REFERENCES Turf (Turf_ID)
);

CREATE TABLE Manages (
    Admin_ID INT NOT NULL,
    Turf_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Admin_ID , Turf_ID),
    FOREIGN KEY (Admin_ID)
        REFERENCES Admin (Admin_ID),
    FOREIGN KEY (Turf_ID)
        REFERENCES Turf (Turf_ID)
);


CREATE INDEX idx_booking_date ON Booking(Booking_Date);
CREATE INDEX idx_booking_status ON Booking(Status);
CREATE INDEX idx_turf_location ON Turf(Location);
CREATE INDEX idx_turf_sport_type ON Turf(Sport_Type);
CREATE INDEX idx_customer_email ON Customer(Email);
CREATE INDEX idx_turf_owner_email ON Turf_Owner(Email);
