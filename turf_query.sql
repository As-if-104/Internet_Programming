use Turf_Booking;

-- 1. Get all active turfs
SELECT * FROM Turf WHERE Is_Active = true;

-- 2. Get all customers
SELECT Customer_Name, Email, Phone FROM Customer;

-- 3. Get all bookings for today
SELECT * FROM Booking WHERE Booking_Date = CURDATE();

-- 4. Get all completed bookings
SELECT * FROM Booking WHERE Status = 'completed';

-- 5. Get all turfs by sport type
SELECT Turf_Name, Location, Hourly_Rate FROM Turf WHERE Sport_Type = 'Football';


-- 6. Get customer details with their bookings
SELECT c.Customer_Name, c.Email, b.Booking_Date, b.Start_Time, b.End_Time, b.Total_Amount
FROM Customer c
JOIN Booking b ON c.Customer_ID = b.Customer_ID;

-- 7. Get turf details with owner information
SELECT t.Turf_Name, t.Location, t.Sport_Type, o.Owner_Name, o.Email
FROM Turf t
JOIN Turf_Owner o ON t.Owner_ID = o.Owner_ID;

-- 8. Get booking details with customer and turf information
SELECT b.Booking_ID, c.Customer_Name, t.Turf_Name, b.Booking_Date, b.Status
FROM Booking b
JOIN Customer c ON b.Customer_ID = c.Customer_ID
JOIN Turf t ON b.Turf_ID = t.Turf_ID;

-- 9. Get reviews with customer and turf details
SELECT r.Rating, r.Comment, c.Customer_Name, t.Turf_Name
FROM Review r
JOIN Customer c ON r.Customer_ID = c.Customer_ID
JOIN Turf t ON r.Turf_ID = t.Turf_ID;

-- 10. Get payment details with booking information
SELECT p.Payment_ID, p.Amount, p.Payment_Method, p.Payment_Status, b.Booking_Date
FROM Payment p
JOIN Booking b ON p.Booking_ID = b.Booking_ID;

-- 11. Count total bookings per turf
SELECT t.Turf_Name, COUNT(b.Booking_ID) as Total_Bookings
FROM Turf t
LEFT JOIN Booking b ON t.Turf_ID = b.Turf_ID
GROUP BY t.Turf_ID, t.Turf_Name;

-- 12. Calculate total revenue per turf
SELECT t.Turf_Name, SUM(b.Total_Amount) as Total_Revenue
FROM Turf t
JOIN Booking b ON t.Turf_ID = b.Turf_ID
WHERE b.Status = 'completed'
GROUP BY t.Turf_ID, t.Turf_Name;

-- 13. Average rating per turf
SELECT t.Turf_Name, AVG(r.Rating) as Average_Rating, COUNT(r.Review_ID) as Total_Reviews
FROM Turf t
LEFT JOIN Review r ON t.Turf_ID = r.Turf_ID
GROUP BY t.Turf_ID, t.Turf_Name;

-- 14. Count bookings per customer
SELECT c.Customer_Name, COUNT(b.Booking_ID) as Total_Bookings
FROM Customer c
LEFT JOIN Booking b ON c.Customer_ID = b.Customer_ID
GROUP BY c.Customer_ID, c.Customer_Name;

-- 15. Monthly booking statistics
SELECT 
    YEAR(Booking_Date) as Year,
    MONTH(Booking_Date) as Month,
    COUNT(*) as Total_Bookings,
    SUM(Total_Amount) as Monthly_Revenue
FROM Booking
GROUP BY YEAR(Booking_Date), MONTH(Booking_Date)
ORDER BY Year DESC, Month DESC;


-- 16. Find turfs in a specific location
SELECT * FROM Turf WHERE Location LIKE '%Dhaka%';

-- 17. Get bookings within a date range
SELECT * FROM Booking 
WHERE Booking_Date BETWEEN '2024-01-01' AND '2024-12-31';

-- 18. Find turfs with hourly rate less than a certain amount
SELECT Turf_Name, Location, Hourly_Rate 
FROM Turf 
WHERE CAST(Hourly_Rate AS DECIMAL) < 1000;

-- 19. Get pending bookings
SELECT b.*, c.Customer_Name, t.Turf_Name
FROM Booking b
JOIN Customer c ON b.Customer_ID = c.Customer_ID
JOIN Turf t ON b.Turf_ID = t.Turf_ID
WHERE b.Status = 'pending';

-- 20. Find customers with specific email domain
SELECT * FROM Customer WHERE Email LIKE '%@gmail.com';


-- 21. Find most popular turf (most bookings)
SELECT t.Turf_Name, COUNT(b.Booking_ID) as Booking_Count
FROM Turf t
JOIN Booking b ON t.Turf_ID = b.Turf_ID
GROUP BY t.Turf_ID, t.Turf_Name
ORDER BY Booking_Count DESC
LIMIT 1;

-- 22. Get customer's favorite turfs
SELECT c.Customer_Name, t.Turf_Name, t.Location
FROM Customer c
JOIN Favorites f ON c.Customer_ID = f.Customer_ID
JOIN Turf t ON f.Turf_ID = t.Turf_ID;

-- 23. Find turfs managed by admins
SELECT a.Admin_Name, t.Turf_Name, t.Location
FROM Admin a
JOIN Manages m ON a.Admin_ID = m.Admin_ID
JOIN Turf t ON m.Turf_ID = t.Turf_ID;

-- 24. Get bookings with their payment status
SELECT 
    b.Booking_ID,
    c.Customer_Name,
    t.Turf_Name,
    b.Booking_Date,
    b.Total_Amount,
    COALESCE(p.Payment_Status, 'No Payment') as Payment_Status
FROM Booking b
JOIN Customer c ON b.Customer_ID = c.Customer_ID
JOIN Turf t ON b.Turf_ID = t.Turf_ID
LEFT JOIN Payment p ON b.Booking_ID = p.Booking_ID;

-- 25. Find customers who haven't made any bookings
SELECT c.Customer_Name, c.Email
FROM Customer c
LEFT JOIN Booking b ON c.Customer_ID = b.Customer_ID
WHERE b.Customer_ID IS NULL;

UPDATE Booking SET Status = 'confirmed' WHERE Booking_ID = 1;

-- 27. Update turf hourly rate
UPDATE Turf SET Hourly_Rate = '1500' WHERE Turf_ID = 1;

-- 28. Deactivate a turf
UPDATE Turf SET Is_Active = false WHERE Turf_ID = 1;


-- 29. Delete cancelled bookings older than 30 days
DELETE FROM Booking 
WHERE Status = 'cancelled' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 30. Remove a customer's favorite turf
DELETE FROM Favorites 
WHERE Customer_ID = 1 AND Turf_ID = 1;