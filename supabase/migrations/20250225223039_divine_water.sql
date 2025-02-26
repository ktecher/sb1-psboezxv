/*
  # Add more places for each category

  1. New Places
    - Added 10+ places for each category:
      - Restaurants & Cafes
      - Shopping
      - Cultural Sites
      - Entertainment
      - Events
      - Kids Activity
    - Added seasonal activities for both summer and winter

  2. Features
    - Each place includes:
      - Name
      - Description
      - Category
      - Address
      - Images (from Unsplash)
      - Rating
      - Features array
      - Seasonal tag (where applicable)
*/

-- More Restaurants & Cafes
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Dar Hamad',
  'Upscale Kuwaiti restaurant serving traditional dishes in a modern setting.',
  'Restaurants & Cafes',
  'Gulf Road, Sharq',
  ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'],
  4.8,
  ARRAY['Fine Dining', 'Traditional Cuisine', 'Private Rooms']
),
(
  'Cafe Supreme',
  'Contemporary cafe with international menu and specialty coffee.',
  'Restaurants & Cafes',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Coffee Specialties', 'Breakfast', 'Outdoor Seating']
),
(
  'Salhiya Social',
  'Modern fusion restaurant combining local and international flavors.',
  'Restaurants & Cafes',
  'Salhiya Complex',
  ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Fusion Cuisine', 'Lounge Area', 'Live Music']
),
(
  'Le Pain Quotidien',
  'Belgian bakery and restaurant known for organic ingredients.',
  'Restaurants & Cafes',
  '360 Mall',
  ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Organic Food', 'Fresh Bakery', 'Breakfast']
),
(
  'Naranj',
  'Lebanese restaurant with authentic mezze and grills.',
  'Restaurants & Cafes',
  'Marina Crescent',
  ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Lebanese Cuisine', 'Sea View', 'Shisha']
);

-- More Shopping Destinations
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Marina Mall',
  'Waterfront shopping center with diverse retail and dining options.',
  'Shopping',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Sea View', 'Food Court', 'Fashion Stores']
),
(
  'Al Kout Mall',
  'Modern mall with traditional architectural elements.',
  'Shopping',
  'Fahaheel',
  ARRAY['https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Waterfront', 'Entertainment', 'Dining']
),
(
  'Symphony Style Mall',
  'Luxury shopping destination with high-end brands.',
  'Shopping',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Designer Brands', 'Valet Parking', 'Fine Dining']
),
(
  'Gate Mall',
  'Boutique shopping center with local designers.',
  'Shopping',
  'Egaila',
  ARRAY['https://images.unsplash.com/photo-1555529771-7888783a18d3?w=800&h=600&fit=crop'],
  4.2,
  ARRAY['Local Designers', 'Cafes', 'Beauty Salon']
),
(
  'Al Hamra Tower',
  'Luxury shopping in Kuwait''s tallest building.',
  'Shopping',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Observation Deck', 'Fine Dining', 'Premium Brands']
);

-- More Cultural Sites
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'National Museum of Kuwait',
  'Museum showcasing Kuwait''s heritage and history.',
  'Cultural Sites',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Historical Exhibits', 'Guided Tours', 'Gift Shop']
),
(
  'Bait Al Othman Museum',
  'Traditional Kuwaiti house turned museum.',
  'Cultural Sites',
  'Hawalli',
  ARRAY['https://images.unsplash.com/photo-1566375638495-8fd7c9a3f8f7?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Traditional Architecture', 'Cultural Exhibits', 'Local History']
),
(
  'Al Sadu House',
  'Traditional weaving museum celebrating Bedouin crafts.',
  'Cultural Sites',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Craft Workshops', 'Gift Shop', 'Cultural Programs']
),
(
  'Mirror House',
  'Unique artistic house covered in mirror mosaics.',
  'Cultural Sites',
  'Qadisiya',
  ARRAY['https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Art Gallery', 'Guided Tours', 'Photography']
),
(
  'Dickson House',
  'Historical British political agency building.',
  'Cultural Sites',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Historical Site', 'Museum', 'Architecture']
);

-- More Entertainment Venues
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Kuwait Magic',
  'Family entertainment center with rides and games.',
  'Entertainment',
  'Coastal Road',
  ARRAY['https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Arcade', 'Theme Park Rides', 'Food Court']
),
(
  'Ice Skating Rink',
  'Olympic-sized ice skating rink.',
  'Entertainment',
  'Al-Rai',
  ARRAY['https://images.unsplash.com/photo-1572798703897-53b0ce7fdce7?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Ice Skating', 'Training Programs', 'Equipment Rental']
),
(
  'Cinescape Cinemas',
  'Modern cinema complex showing latest releases.',
  'Entertainment',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['IMAX', 'VIP Seating', 'Food Court']
),
(
  'Sky Zone Kuwait',
  'Indoor trampoline park with various activities.',
  'Entertainment',
  'Al Rai',
  ARRAY['https://images.unsplash.com/photo-1526718583451-e88ebf774771?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Trampolines', 'Fitness Programs', 'Party Rooms']
),
(
  'Boulevard Bowling Center',
  'Modern bowling alley with arcade games.',
  'Entertainment',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1553190920-a9c7432283e9?w=800&h=600&fit=crop'],
  4.2,
  ARRAY['Bowling', 'Arcade', 'Snack Bar']
);

-- More Events
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Kuwait International Book Fair',
  'Annual literary event featuring publishers worldwide.',
  'Events',
  'Kuwait International Fair Ground',
  ARRAY['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Book Sales', 'Author Meetings', 'Cultural Activities']
),
(
  'Food Truck Festival',
  'Weekend food festival with local and international cuisine.',
  'Events',
  'Marina Crescent',
  ARRAY['https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Food Trucks', 'Live Music', 'Family Entertainment']
),
(
  'Kuwait Motor Show',
  'Annual automotive exhibition showcasing latest vehicles.',
  'Events',
  'Kuwait International Fair',
  ARRAY['https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Car Display', 'Test Drives', 'Auto Accessories']
),
(
  'Art Exhibition Center',
  'Contemporary art exhibitions and cultural events.',
  'Events',
  'Abdullah Al Salem',
  ARRAY['https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Art Gallery', 'Workshops', 'Cultural Events']
),
(
  'Musical Fountain Show',
  'Daily water and light show at the Gulf Road.',
  'Events',
  'Gulf Road',
  ARRAY['https://images.unsplash.com/photo-1533162507191-d90c625b2640?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Light Show', 'Music', 'Photography Spot']
);

-- More Kids Activities
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'KidZania Kuwait',
  'Educational entertainment center for children.',
  'Kids Activity',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Role Play', 'Learning Activities', 'Birthday Parties']
),
(
  'Little Gym Kuwait',
  'Children''s physical development center.',
  'Kids Activity',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Gymnastics', 'Dance', 'Parent-Child Classes']
),
(
  'Cartoon Network World',
  'Indoor theme park with cartoon characters.',
  'Kids Activity',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Character Meet & Greet', 'Interactive Games', 'Birthday Packages']
),
(
  'Fun City',
  'Indoor amusement center for children.',
  'Kids Activity',
  '360 Mall',
  ARRAY['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Arcade Games', 'Soft Play Area', 'Party Rooms']
),
(
  'Kuwait Magic Planet',
  'Family entertainment center with games and rides.',
  'Kids Activity',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Arcade', 'Rides', 'Family Entertainment']
);

-- More Seasonal Activities
INSERT INTO places (name, description, category, address, images, rating, features, seasonal) VALUES
(
  'Marina Beach Club',
  'Exclusive beach club with pools and water sports.',
  'Entertainment',
  'Salmiya Marina',
  ARRAY['https://images.unsplash.com/photo-1531701915437-41c97aa687e4?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Private Beach', 'Water Sports', 'Restaurant'],
  'summer'
),
(
  'Desert Adventures',
  'Summer desert camping and adventure activities.',
  'Entertainment',
  'Kuwait Desert',
  ARRAY['https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Dune Bashing', 'Camping', 'BBQ'],
  'summer'
),
(
  'Winter Wonderland',
  'Seasonal festival with winter-themed activities.',
  'Events',
  '360 Mall External Area',
  ARRAY['https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Ice Skating', 'Winter Market', 'Live Shows'],
  'winter'
),
(
  'Green Island',
  'Artificial island with winter gardens and walking paths.',
  'Entertainment',
  'Arabian Gulf Street',
  ARRAY['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Gardens', 'Walking Trails', 'Cafes'],
  'winter'
);