use Turf_Booking;

-- Insert Admin data
INSERT INTO Admin (Admin_Name, Email, Password, Phone) VALUES
('MD Naimul Islam Asif', 'asif.admin@turfbook.com', 'admin123', '+8801712345678'),
('Pritam Biswas', 'pritam.manager@turfbook.com', 'admin456', '+8801823456789'),
('Nahid Hasan', 'nahid.super@turfbook.com', 'admin789', '+8801934567890');

-- Insert Customer data
INSERT INTO Customer (Customer_Name, Email, Password, Phone, Address) VALUES
('Ahmed Rahman', 'ahmed.rahman@gmail.com', 'pass123', '+8801611111111', 'Dhanmondi, Dhaka'),
('Fatima Khan', 'fatima.khan@yahoo.com', 'pass456', '+8801622222222', 'Gulshan, Dhaka'),
('Mohammad Ali', 'mohammad.ali@outlook.com', 'pass789', '+8801633333333', 'Uttara, Dhaka'),
('Rashida Begum', 'rashida.begum@gmail.com', 'pass321', '+8801644444444', 'Mirpur, Dhaka'),
('Karim Hassan', 'karim.hassan@hotmail.com', 'pass654', '+8801655555555', 'Wari, Dhaka'),
('Nadia Islam', 'nadia.islam@gmail.com', 'pass987', '+8801666666666', 'Banani, Dhaka'),
('Tareq Ahmed', 'tareq.ahmed@yahoo.com', 'pass111', '+8801677777777', 'Mohammadpur, Dhaka'),
('Salma Khatun', 'salma.khatun@gmail.com', 'pass222', '+8801688888888', 'Shantinagar, Dhaka');

-- Insert Turf Owner data
INSERT INTO Turf_Owner (Owner_Name, Email, Password, Phone) VALUES
('Rafiq Sports Complex', 'rafiq@sports.com', 'owner123', '+8801511111111'),
('Green Field Owners', 'greenfield@turf.com', 'owner456', '+8801522222222'),
('City Sports Ltd', 'citysports@company.com', 'owner789', '+8801533333333'),
('Premier Turf Co', 'premier@turf.com', 'owner321', '+8801544444444'),
('Golden Goal Arena', 'goldgoal@arena.com', 'owner654', '+8801555555555');

-- Insert Turf data
INSERT INTO Turf (Owner_ID, Turf_Name, Location, Sport_Type, Hourly_Rate, Description, Is_Active) VALUES
(1, 'Rafiq Football Ground', 'Dhanmondi, Dhaka', 'Football', '1200', 'Professional football turf with floodlights', true),
(1, 'Rafiq Cricket Pitch', 'Dhanmondi, Dhaka', 'Cricket', '1500', 'Full size cricket ground with practice nets', true),
(2, 'Green Field Soccer', 'Gulshan, Dhaka', 'Football', '1000', 'Artificial grass football field', true),
(2, 'Green Field Basketball', 'Gulshan, Dhaka', 'Basketball', '800', 'Indoor basketball court with AC', true),
(3, 'City Sports Football', 'Uttara, Dhaka', 'Football', '1100', 'Natural grass football field', true),
(3, 'City Sports Tennis', 'Uttara, Dhaka', 'Tennis', '600', 'Clay court tennis facility', true),
(4, 'Premier Football Arena', 'Mirpur, Dhaka', 'Football', '1300', 'Premium football turf with modern facilities', true),
(4, 'Premier Badminton Hall', 'Mirpur, Dhaka', 'Badminton', '500', 'Indoor badminton courts', true),
(5, 'Golden Goal Stadium', 'Banani, Dhaka', 'Football', '1400', 'Mini stadium with seating arrangement', true),
(5, 'Golden Hockey Field', 'Banani, Dhaka', 'Hockey', '900', 'Synthetic hockey turf', false);

-- Insert Booking data
INSERT INTO Booking (Customer_ID, Turf_ID, Booking_Date, Start_Time, End_Time, Total_Amount, Status) VALUES
(1, 1, '2024-12-15', '16:00:00', '18:00:00', 2400.00, 'completed'),
(2, 3, '2024-12-16', '14:00:00', '16:00:00', 2000.00, 'completed'),
(3, 5, '2024-12-17', '18:00:00', '20:00:00', 2200.00, 'confirmed'),
(4, 2, '2024-12-18', '10:00:00', '12:00:00', 3000.00, 'confirmed'),
(5, 7, '2024-12-19', '17:00:00', '19:00:00', 2600.00, 'pending'),
(6, 4, '2024-12-20', '15:00:00', '17:00:00', 1600.00, 'confirmed'),
(7, 6, '2024-12-21', '09:00:00', '11:00:00', 1200.00, 'completed'),
(8, 8, '2024-12-22', '19:00:00', '21:00:00', 1000.00, 'pending'),
(1, 9, '2024-12-23', '16:00:00', '18:00:00', 2800.00, 'confirmed'),
(2, 1, '2024-12-24', '14:00:00', '16:00:00', 2400.00, 'cancelled'),
(3, 3, '2025-01-15', '16:00:00', '18:00:00', 2000.00, 'confirmed'),
(4, 5, '2025-01-16', '17:00:00', '19:00:00', 2200.00, 'pending'),
(5, 2, '2025-01-17', '11:00:00', '13:00:00', 3000.00, 'confirmed'),
(6, 7, '2025-01-18', '18:00:00', '20:00:00', 2600.00, 'pending'),
(7, 4, '2025-01-19', '14:00:00', '16:00:00', 1600.00, 'confirmed');

-- Insert Payment data
INSERT INTO Payment (Booking_ID, Amount, Payment_Method, Payment_Status, Transaction_ID, Payment_Date) VALUES
(1, 2400.00, 'Credit Card', 'completed', 'TXN001234567', '2024-12-15 10:30:00'),
(2, 2000.00, 'Mobile Banking', 'completed', 'TXN001234568', '2024-12-16 09:15:00'),
(3, 2200.00, 'Debit Card', 'completed', 'TXN001234569', '2024-12-17 11:45:00'),
(4, 3000.00, 'Mobile Banking', 'completed', 'TXN001234570', '2024-12-18 08:20:00'),
(5, 2600.00, 'Credit Card', 'pending', 'TXN001234571', NULL),
(6, 1600.00, 'Cash', 'completed', 'TXN001234572', '2024-12-20 12:00:00'),
(7, 1200.00, 'Mobile Banking', 'completed', 'TXN001234573', '2024-12-21 07:30:00'),
(8, 1000.00, 'Debit Card', 'pending', 'TXN001234574', NULL),
(9, 2800.00, 'Credit Card', 'completed', 'TXN001234575', '2024-12-23 13:15:00'),
(10, 2400.00, 'Mobile Banking', 'refunded', 'TXN001234576', '2024-12-24 10:45:00');

-- Insert Review data
INSERT INTO Review (Customer_ID, Turf_ID, Rating, Comment) VALUES
(1, 1, 5, 'Excellent football ground with great facilities. Highly recommended!'),
(2, 3, 4, 'Good turf quality, but parking could be better.'),
(3, 5, 5, 'Amazing experience! Well maintained ground and friendly staff.'),
(4, 2, 4, 'Nice cricket pitch, but a bit expensive.'),
(5, 7, 3, 'Average facility, nothing special but okay for the price.'),
(6, 4, 5, 'Best basketball court in the area! Clean and well equipped.'),
(7, 6, 4, 'Good tennis court, proper maintenance and good lighting.'),
(8, 8, 2, 'Poor service, booking was delayed and facilities were not clean.'),
(1, 9, 5, 'Premium quality stadium! Worth every penny.'),
(2, 1, 4, 'Second visit, still good but they should improve changing rooms.');

-- Insert Favorites data
INSERT INTO Favorites (Customer_ID, Turf_ID) VALUES
(1, 1),
(1, 9),
(2, 3),
(2, 1),
(3, 5),
(3, 2),
(4, 2),
(4, 7),
(5, 7),
(5, 4),
(6, 4),
(6, 8),
(7, 6),
(7, 3),
(8, 8);

-- Insert Manages data (Admin manages Turfs)
INSERT INTO Manages (Admin_ID, Turf_ID) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(1, 10);