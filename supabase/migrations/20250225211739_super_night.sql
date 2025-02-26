/*
  # Insert initial places data

  This migration adds sample places data for Kuwait across different categories:
  - Restaurants & Cafes
  - Shopping (Malls, Souks)
  - Cultural Sites
  - Entertainment
  - Events
  - Kids Activity
  - Top Rated
  - Seasonal Activities (Summer/Winter)

  Each place includes:
  - Name
  - Description
  - Category
  - Address
  - Images
  - Rating
  - Features
  - Seasonal flag (for summer/winter activities)
*/

-- Restaurants & Cafes
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Al Mubarakiya Cafe',
  'Traditional Kuwaiti cafe serving authentic local dishes and Arabic coffee in the heart of the old market.',
  'Restaurants & Cafes',
  'Al Mubarakiya Market, Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop'],
  4.8,
  ARRAY['Outdoor Seating', 'Traditional Food', 'Historic Location']
),
(
  'Marina Waves Restaurant',
  'Modern seafood restaurant with panoramic views of the Arabian Gulf.',
  'Restaurants & Cafes',
  'Marina Waves Complex, Salmiya',
  ARRAY['https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Sea View', 'Fine Dining', 'Valet Parking']
);

-- Shopping
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'The Avenues Mall',
  'Kuwait''s largest shopping mall featuring international brands, dining, and entertainment.',
  'Shopping',
  'Al-Rai, 5th Ring Road',
  ARRAY['https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Luxury Brands', 'Food Court', 'Cinema', 'Parking']
),
(
  'Souk Al-Mubarakiya',
  'Historic market featuring traditional goods, spices, and local crafts.',
  'Shopping',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Traditional Market', 'Local Crafts', 'Historic Site']
);

-- Cultural Sites
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Kuwait Towers',
  'Iconic symbol of Kuwait featuring observation deck and restaurants.',
  'Cultural Sites',
  'Arabian Gulf Street, Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'],
  4.9,
  ARRAY['Observation Deck', 'Restaurant', 'Historic Landmark']
),
(
  'Grand Mosque',
  'Kuwait''s largest mosque showcasing Islamic architecture and design.',
  'Cultural Sites',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1542127306-0b4688b0a0a5?w=800&h=600&fit=crop'],
  4.8,
  ARRAY['Guided Tours', 'Architecture', 'Religious Site']
);

-- Entertainment
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  '360 Mall Entertainment',
  'Modern entertainment complex with games, bowling, and virtual reality experiences.',
  'Entertainment',
  '360 Mall, South Surra',
  ARRAY['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Arcade', 'Bowling', 'VR Games']
),
(
  'Kuwait Opera House',
  'Premier venue for performing arts and cultural events.',
  'Entertainment',
  'Abdullah Al-Ahmad Cultural Center',
  ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Live Performances', 'Cultural Events', 'Modern Architecture']
);

-- Events
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Hala February Festival',
  'Annual cultural festival celebrating Kuwait''s heritage and independence.',
  'Events',
  'Various Locations',
  ARRAY['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Cultural Shows', 'Food Stalls', 'Family Activities']
);

-- Kids Activity
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'KidZania Kuwait',
  'Educational entertainment center where children can role-play different professions.',
  'Kids Activity',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Educational', 'Interactive', 'Safe Environment']
),
(
  'Scientific Center Kuwait',
  'Interactive science museum with aquarium and IMAX theater.',
  'Kids Activity',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Aquarium', 'IMAX Theater', 'Educational Programs']
);

-- Summer Activities
INSERT INTO places (name, description, category, address, images, rating, features, seasonal) VALUES
(
  'Aqua Park Kuwait',
  'Largest water park in Kuwait with slides and pools.',
  'Entertainment',
  'Arab Gulf Street',
  ARRAY['https://images.unsplash.com/photo-1533163857297-f96720ae4d58?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Water Slides', 'Swimming Pools', 'Family Friendly'],
  'summer'
);

-- Winter Activities
INSERT INTO places (name, description, category, address, images, rating, features, seasonal) VALUES
(
  'Al Shaheed Park',
  'Large urban park perfect for winter picnics and outdoor activities.',
  'Entertainment',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Walking Trails', 'Gardens', 'Museums'],
  'winter'
);

-- Top Rated (automatically determined by rating)