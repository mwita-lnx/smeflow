# SmeFlow Seeded Data Documentation

## Overview
This document provides a comprehensive overview of all the test data seeded into the SmeFlow database. The data represents a realistic Kenyan SME marketplace with diverse businesses, products, services, and user interactions.

---

## 📊 Data Summary

| Category | Count |
|----------|-------|
| **Business Categories** | 16 |
| **SME Users** | 12 |
| **Consumer Users** | 5 |
| **Admin Users** | 1 |
| **Businesses** | 20 |
| **Products/Services** | 113+ |
| **Reviews & Ratings** | 19 |
| **Tenders** | 6 |
| **Bids** | 4 |

---

## 👥 Test User Accounts

### Admin Account
- **Email**: admin@smeflow.co.ke
- **Password**: (from .env configuration)
- **Role**: ADMIN

### SME Users (Business Owners)
All SME users use password: **Password123**

1. **kamau.dairy@example.com** - John Kamau (Dairy Farmer)
2. **mama.fua@example.com** - Grace Nyambura (Laundry Services)
3. **mwangi.welder@example.com** - Peter Mwangi (Jua Kali Welder)
4. **akinyi.tailor@example.com** - Lucy Akinyi (Tailor)
5. **hassan.butchery@example.com** - Hassan Mohammed (Butchery)
6. **wanjiru.salon@example.com** - Mary Wanjiru (Salon)
7. **omondi.vegetables@example.com** - David Omondi (Vegetable Vendor)
8. **njeri.bakery@example.com** - Jane Njeri (Baker)
9. **otieno.electronics@example.com** - James Otieno (Electronics Repair)
10. **chege.carpenter@example.com** - Samuel Chege (Jua Kali Carpenter)
11. **wambui.restaurant@example.com** - Anne Wambui (Restaurant)
12. **kipchoge.shoes@example.com** - Joseph Kipchoge (Shoe Repair)

### Consumer Users
All consumer users use password: **Password123**

1. **consumer1@example.com** - Michael Odhiambo
2. **consumer2@example.com** - Sarah Mutua
3. **consumer3@example.com** - Robert Kariuki
4. **consumer4@example.com** - Esther Adhiambo
5. **consumer5@example.com** - Daniel Kiprono

---

## 🏪 Businesses & Products

### 1. Kamau Dairy Farm
- **Category**: Agriculture & Farming
- **Location**: Kiambu, Limuru
- **Verification**: ✅ VERIFIED
- **Products** (4):
  - Fresh Cow Milk (1L) - KES 80
  - Fresh Cow Milk (5L) - KES 380
  - Fresh Yoghurt (500ml) - KES 120
  - Mala (Fermented Milk - 1L) - KES 100
- **Rating**: ⭐ 4.5/5 (2 reviews)

### 2. Grace Laundry Services (Mama Fua)
- **Category**: Services
- **Location**: Nairobi, Embakasi (Donholm)
- **Verification**: ✅ BASIC
- **M-Pesa Till**: 567890
- **Products** (5):
  - Shirt/Blouse Wash & Iron - KES 80
  - Trouser/Skirt Wash & Iron - KES 100
  - Bedsheets & Duvet Set - KES 350
  - Curtains per Meter - KES 150
  - Suit Dry Cleaning - KES 500
- **Rating**: ⭐ 5/5 (1 review)

### 3. Mwangi Welding & Fabrication (Jua Kali)
- **Category**: Construction
- **Location**: Nairobi, Industrial Area
- **Verification**: ✅ VERIFIED
- **Products** (5):
  - Main Gate (Standard Size) - KES 35,000
  - Window Grills per Window - KES 4,500
  - Burglar Proofing per Window - KES 3,500
  - Metal Door Frame - KES 8,000
  - Steel Staircase Railing (per meter) - KES 2,500
- **Rating**: ⭐ 4.5/5 (2 reviews)

### 4. Akinyi Fashion House
- **Category**: Services (Tailoring)
- **Location**: Kisumu, Kisumu Central
- **Verification**: ✅ PREMIUM
- **WhatsApp**: +254712000004
- **Products** (5):
  - Custom Dress (Simple Design) - KES 1,500
  - Custom Dress (Detailed Design) - KES 3,500
  - Men's Suit (Tailoring) - KES 4,000
  - African Wear (Kitenge/Ankara) - KES 2,500
  - Clothing Alterations - KES 300
- **Rating**: ⭐ 5/5 (1 review)

### 5. Hassan Fresh Butchery
- **Category**: Food & Beverage
- **Location**: Mombasa, Mvita (Old Town)
- **Verification**: ✅ VERIFIED
- **Special**: Halal certified
- **Products** (6):
  - Beef (Soft Bone - 1kg) - KES 550
  - Beef (Boneless - 1kg) - KES 620
  - Goat Meat (1kg) - KES 700
  - Whole Chicken - KES 450
  - Chicken Pieces (1kg) - KES 380
  - Mince Meat (1kg) - KES 480
- **Rating**: ⭐ 5/5 (1 review)

### 6. Wanjiru Beauty Lounge
- **Category**: Health & Beauty
- **Location**: Nakuru, Nakuru East
- **Verification**: ✅ PREMIUM
- **M-Pesa Paybill**: 400200
- **Products** (7):
  - Box Braids - KES 2,000
  - Cornrows - KES 800
  - Weave Installation (Full Head) - KES 1,500
  - Hair Relaxing/Perming - KES 1,200
  - Hair Coloring - KES 2,500
  - Wash & Blow Dry - KES 600
  - Deep Conditioning Treatment - KES 800
- **Rating**: ⭐ 4.5/5 (2 reviews)

### 7. Omondi Fresh Greens
- **Category**: Retail & Shop
- **Location**: Nairobi, Dagoretti (Kawangware Market)
- **Verification**: ✅ BASIC
- **Products** (8):
  - Sukuma Wiki (1 bunch) - KES 20
  - Spinach (1 bunch) - KES 30
  - Tomatoes (1kg) - KES 80
  - Onions (1kg) - KES 70
  - Potatoes (2kg) - KES 120
  - Cabbage (1 head) - KES 60
  - Bananas (1 bunch) - KES 100
  - Avocados (3 pieces) - KES 150
- **Rating**: ⭐ 5/5 (1 review)

### 8. Njeri's Home Bakery
- **Category**: Food & Beverage
- **Location**: Nyeri, Nyeri Town
- **Verification**: ✅ VERIFIED
- **Products** (7):
  - White Bread (400g) - KES 55
  - Brown Bread (400g) - KES 70
  - Mandazi (6 pieces) - KES 50
  - Chapati (10 pieces) - KES 200
  - Scones (6 pieces) - KES 120
  - Birthday Cake (1kg) - KES 1,500
  - Cupcakes (6 pieces) - KES 300
- **Rating**: ⭐ 5/5 (1 review)

### 9. Otieno Tech Solutions
- **Category**: Technology
- **Location**: Nairobi, CBD (Luthuli Avenue)
- **Verification**: ✅ VERIFIED
- **Products** (6):
  - Phone Screen Replacement - KES 2,500
  - Phone Battery Replacement - KES 1,200
  - Laptop Screen Replacement - KES 8,000
  - Software Installation & Troubleshooting - KES 500
  - Phone Unlocking - KES 300
  - Data Recovery - KES 1,500
- **Rating**: ⭐ 4/5 (1 review)

### 10. Chege Furniture Workshop (Jua Kali)
- **Category**: Manufacturing
- **Location**: Nairobi, Gikomba
- **Verification**: ✅ PREMIUM
- **Products** (7):
  - Bed Frame (5x6) - KES 15,000
  - Wardrobe (3-Door) - KES 25,000
  - Dining Table (6-Seater) - KES 35,000
  - Coffee Table - KES 8,000
  - TV Stand - KES 12,000
  - Office Desk - KES 18,000
  - Kitchen Cabinets (per meter) - KES 15,000
- **Rating**: ⭐ 5/5 (1 review)

### 11. Wambui's Mama Pima
- **Category**: Food & Beverage (Restaurant)
- **Location**: Nairobi, Eastleigh
- **Verification**: ✅ BASIC
- **M-Pesa Till**: 789012
- **Products** (7):
  - Ugali & Beef Stew - KES 150
  - Chapati & Beans - KES 100
  - Pilau (Beef) - KES 200
  - Githeri (Special) - KES 80
  - Chicken & Chips - KES 250
  - Tea/Chai (Cup) - KES 30
  - Mandazi (2 pieces) - KES 20
- **Rating**: ⭐ 5/5 (1 review)

### 12. Kipchoge Shoe Clinic (Jua Kali)
- **Category**: Services
- **Location**: Eldoret, Eldoret West
- **Verification**: ✅ BASIC
- **Products** (6):
  - Shoe Sole Replacement - KES 300
  - Shoe Stretching - KES 200
  - Shoe Polishing & Cleaning - KES 150
  - Zip Replacement - KES 250
  - Custom Leather Shoes (Men) - KES 4,500
  - School Shoes Repair - KES 200
- **Rating**: ⭐ 5/5 (1 review)

### 13. Otieno Plumbing Services (Jua Kali)
- **Category**: Services
- **Location**: Nairobi, Kayole
- **Verification**: ✅ VERIFIED
- **Special**: 24/7 emergency services
- **Products** (5):
  - Toilet Installation - KES 3,500
  - Sink Installation - KES 2,000
  - Water Tank Cleaning (5000L) - KES 2,500
  - Blocked Drain Clearing - KES 1,500
  - Bathroom Renovation - KES 25,000

### 14. Wanjiku Poultry Farm
- **Category**: Agriculture & Farming
- **Location**: Kiambu, Kikuyu
- **Verification**: ✅ PREMIUM
- **Products** (4):
  - Tray of Eggs (30 pcs) - KES 420
  - Live Chicken (Kienyeji) - KES 800
  - Dressed Chicken (Broiler) - KES 650
  - Day-Old Chicks (10 pcs) - KES 500
- **Rating**: ⭐ 5/5 (1 review)

### 15. Kipkemoi Motorcycle Spares
- **Category**: Retail & Shop
- **Location**: Nairobi, Umoja
- **Verification**: ✅ BASIC
- **Products** (5):
  - Motorcycle Helmet - KES 1,500
  - Side Mirrors (Pair) - KES 400
  - Motorcycle Chain Set - KES 2,800
  - Motorcycle Tire (Front) - KES 2,200
  - Brake Pads Set - KES 800

### 16. Kamau Fresh Cuts Barber Shop
- **Category**: Health & Beauty
- **Location**: Nairobi, South B
- **Verification**: ✅ VERIFIED
- **Products** (5):
  - Regular Haircut - KES 250
  - Fade Haircut - KES 350
  - Clean Shave - KES 150
  - Beard Trim & Shaping - KES 200
  - Kids Haircut - KES 200
- **Rating**: ⭐ 5/5 (1 review)

### 17. Njoroge Hardware & Building Materials
- **Category**: Construction
- **Location**: Machakos, Machakos Town
- **Verification**: ✅ PREMIUM
- **Special**: Delivery available
- **Products** (5):
  - Cement (50kg Bag) - KES 720
  - Iron Sheet (Mabati) 3m - KES 850
  - Wire Nails (1kg) - KES 150
  - Paint (20L) - KES 4,500
  - Timber (4x2, 12ft) - KES 450
- **Rating**: ⭐ 4/5 (1 review)

### 18. Achieng M-Pesa & Airtime Shop
- **Category**: Services
- **Location**: Kisumu, Kondele
- **Verification**: ✅ VERIFIED
- **M-Pesa Till**: 987654
- **Products** (4):
  - M-Pesa Deposit/Withdrawal - KES 0 (commission-based)
  - Airtime (All Networks) - from KES 10
  - Phone Charger (Universal) - KES 500
  - Phone Case - KES 300

### 19. Smart Cyber Cafe & Printing
- **Category**: Technology
- **Location**: Nairobi, Githurai
- **Verification**: ✅ BASIC
- **Products** (6):
  - Printing (Black & White) - KES 5 per page
  - Printing (Color) - KES 20 per page
  - Photocopy (Per Page) - KES 3
  - Document Binding - KES 100
  - CV Writing & Formatting - KES 300
  - Lamination (A4) - KES 50
- **Rating**: ⭐ 5/5 (1 review)

### 20. Kariuki Matatu Spares
- **Category**: Retail & Shop
- **Location**: Nairobi, Ngara
- **Verification**: ✅ VERIFIED
- **Products** (4):
  - Car Battery (70Ah) - KES 8,500
  - Brake Pads (Set) - KES 3,500
  - Tire (14 inch) - KES 6,500
  - LED Headlights (Pair) - KES 2,500

---

## ⭐ Reviews & Ratings Summary

**Total Reviews**: 19
**Average Rating**: 4.8/5

### Businesses with Reviews:
1. Kamau Dairy Farm - 4.5/5 (2 reviews)
2. Grace Laundry Services - 5/5 (1 review)
3. Mwangi Welding & Fabrication - 4.5/5 (2 reviews)
4. Akinyi Fashion House - 5/5 (1 review)
5. Hassan Fresh Butchery - 5/5 (1 review)
6. Wanjiru Beauty Lounge - 4.5/5 (2 reviews)
7. Omondi Fresh Greens - 5/5 (1 review)
8. Njeri's Home Bakery - 5/5 (1 review)
9. Otieno Tech Solutions - 4/5 (1 review)
10. Chege Furniture Workshop - 5/5 (1 review)
11. Wambui's Mama Pima - 5/5 (1 review)
12. Kipchoge Shoe Clinic - 5/5 (1 review)
13. Wanjiku Poultry Farm - 5/5 (1 review)
14. Kamau Fresh Cuts Barber Shop - 5/5 (1 review)
15. Njoroge Hardware - 4/5 (1 review)
16. Smart Cyber Cafe - 5/5 (1 review)

---

## 📋 Tenders & Bids

### Tender 1: Wedding Catering Service Needed
- **Posted by**: Michael Odhiambo (Consumer)
- **Category**: Food & Beverage
- **Budget**: KES 150,000 - 250,000
- **Location**: Nairobi, Westlands
- **Deadline**: 2025-12-01
- **Status**: OPEN
- **Bids**: 1
  - Wambui's Mama Pima - KES 180,000 (14 days)

### Tender 2: Office Furniture Required
- **Posted by**: Sarah Mutua (Consumer)
- **Category**: Manufacturing
- **Budget**: KES 200,000 - 350,000
- **Location**: Nairobi, Industrial Area
- **Deadline**: 2025-11-20
- **Status**: OPEN
- **Bids**: 1
  - Chege Furniture Workshop - KES 280,000 (28 days)

### Tender 3: Security Gates and Grills Installation
- **Posted by**: Robert Kariuki (Consumer)
- **Category**: Construction
- **Budget**: KES 80,000 - 120,000
- **Location**: Kiambu, Ruiru
- **Deadline**: 2025-11-30
- **Status**: OPEN
- **Bids**: 1
  - Mwangi Welding & Fabrication - KES 95,000 (21 days)

### Tender 4: School Uniform Tailoring - 50 Pieces
- **Posted by**: Esther Adhiambo (Consumer)
- **Category**: Services
- **Budget**: KES 35,000 - 50,000
- **Location**: Kisumu, Kisumu Central
- **Deadline**: 2025-12-10
- **Status**: OPEN
- **Bids**: 1
  - Akinyi Fashion House - KES 42,000 (18 days)

### Tender 5: Plumbing Services for 5 Apartments
- **Posted by**: Daniel Kiprono (Consumer)
- **Category**: Services
- **Budget**: KES 150,000 - 200,000
- **Location**: Nairobi, Donholm
- **Deadline**: 2025-12-05
- **Status**: OPEN
- **Bids**: 0

### Tender 6: Fresh Eggs Supply Contract
- **Posted by**: Michael Odhiambo (Consumer)
- **Category**: Agriculture & Farming
- **Budget**: KES 30,000 - 40,000
- **Location**: Nairobi, Westlands
- **Deadline**: 2025-11-25
- **Status**: OPEN
- **Bids**: 0

---

## 📍 Geographic Distribution

### Counties Represented:
- **Nairobi** (12 businesses)
- **Kiambu** (2 businesses)
- **Kisumu** (2 businesses)
- **Mombasa** (1 business)
- **Nakuru** (1 business)
- **Nyeri** (1 business)
- **Eldoret** (1 business)
- **Machakos** (1 business)

---

## 🏷️ Business Categories

1. **Agriculture & Farming** (2) - Dairy, Poultry
2. **Services** (7) - Laundry, Tailoring, Plumbing, Shoe Repair, M-Pesa, Barber
3. **Construction** (2) - Metal Fabrication, Hardware Store
4. **Food & Beverage** (3) - Butchery, Bakery, Restaurant
5. **Health & Beauty** (2) - Salon, Barbershop
6. **Retail & Shop** (3) - Vegetables, Motorcycle Parts, Matatu Parts
7. **Technology** (2) - Electronics Repair, Cyber Cafe
8. **Manufacturing** (1) - Furniture Workshop

---

## 💰 Price Ranges

### Lowest Prices:
- Photocopy - KES 3/page
- Printing B&W - KES 5/page
- Sukuma Wiki - KES 20/bunch
- Tea/Chai - KES 30/cup

### Highest Prices:
- Dining Table (6-Seater) - KES 35,000
- Main Gate - KES 35,000
- Wardrobe (3-Door) - KES 25,000
- Bathroom Renovation - KES 25,000

### Average Product Price: ~KES 2,500

---

## 🎯 Verification Levels

- **PREMIUM** (4 businesses): Akinyi Fashion House, Wanjiru Beauty Lounge, Chege Furniture Workshop, Wanjiku Poultry Farm, Njoroge Hardware
- **VERIFIED** (9 businesses): Kamau Dairy Farm, Mwangi Welding, Hassan Butchery, Njeri's Bakery, Otieno Tech, Otieno Plumbing, Kamau Barber, Achieng M-Pesa, Kariuki Matatu Spares
- **BASIC** (7 businesses): Grace Laundry, Omondi Vegetables, Kipchoge Shoes, Wambui Restaurant, Kipkemoi Motorcycle, Smart Cyber Cafe

---

## 🔄 API Testing Endpoints

### Authentication
```bash
# Login as SME
POST /api/v1/auth/login
{
  "email": "kamau.dairy@example.com",
  "password": "Password123"
}

# Login as Consumer
POST /api/v1/auth/login
{
  "email": "consumer1@example.com",
  "password": "Password123"
}
```

### Businesses
```bash
# Get all businesses
GET /api/v1/businesses

# Get business by ID
GET /api/v1/businesses/:id

# Search businesses by category
GET /api/v1/businesses?category=Agriculture%20%26%20Farming
```

### Tenders
```bash
# Get all tenders
GET /api/v1/tenders

# Get tender bids
GET /api/v1/tenders/:id/bids
```

### Products
```bash
# Get business products
GET /api/v1/businesses/:businessId/products
```

### Reviews
```bash
# Get business reviews
GET /api/v1/businesses/:businessId/ratings
```

---

## 📝 Notes

- All passwords for test accounts: **Password123**
- Phone numbers follow Kenyan format: +254...
- Prices in Kenyan Shillings (KES)
- Location coordinates are accurate for respective counties
- All users have verified email and phone
- Reviews include quality, service, and value ratings
- Tenders include requirements and deadlines
- Bids include delivery time in days

---

## 🎨 Kenyan Context Features

✅ **Jua Kali Businesses** - Metal fabrication, carpentry, shoe repair
✅ **Traditional Services** - Mama Fua (laundry), roadside vendors
✅ **Local Products** - Kienyeji chicken, mala, githeri, mandazi
✅ **M-Pesa Integration** - Till numbers, Paybill numbers
✅ **Kenyan Locations** - Real counties and sub-counties
✅ **Local Pricing** - Realistic Kenyan market prices
✅ **Boda Boda & Matatu** - Motorcycle and PSV spare parts
✅ **Traditional Food** - Ugali, chapati, pilau, sukuma wiki

---

**Generated**: November 13, 2025
**Version**: 2.0
**Total Products/Services**: 113+
**Database**: MongoDB
**Backend**: Node.js/TypeScript/Express
