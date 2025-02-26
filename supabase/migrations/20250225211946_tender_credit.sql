/*
  # Add more places to existing categories

  This migration adds additional places across different categories:
  - More restaurants and cafes
  - Additional shopping locations
  - More entertainment venues
  - Additional events
  - More kids activities
  - Additional seasonal activities
*/

-- More Restaurants & Cafes
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Salt Restaurant',
  'Contemporary Kuwaiti fusion cuisine with a modern twist.',
  'Restaurants & Cafes',
  'Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Modern Cuisine', 'Outdoor Seating', 'Valet Parking']
),
(
  'Mais Alghanim',
  'Traditional Lebanese and Middle Eastern cuisine in an elegant setting.',
  'Restaurants & Cafes',
  'Gulf Road, Sharq',
  ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Traditional Food', 'Sea View', 'Private Dining']
);

-- More Shopping Locations
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  '360 Mall',
  'Luxury shopping destination with high-end brands and entertainment.',
  'Shopping',
  'South Surra',
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
  4.8,
  ARRAY['Luxury Brands', 'Fine Dining', 'Entertainment']
),
(
  'Gate Mall',
  'Boutique shopping center with local and international brands.',
  'Shopping',
  'Egaila',
  ARRAY['https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Fashion Boutiques', 'Cafes', 'Family Friendly']
);

-- More Entertainment Venues
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Sky Zone Kuwait',
  'Indoor trampoline park with various activities and games.',
  'Entertainment',
  'Al Rai',
  ARRAY['https://images.unsplash.com/photo-1526718583451-e88ebf774771?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Trampolines', 'Fitness Programs', 'Birthday Parties']
),
(
  'Kuwait Magic',
  'Family entertainment center with rides and arcade games.',
  'Entertainment',
  'Coastal Road',
  ARRAY['https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Arcade Games', 'Theme Park Rides', 'Food Court']
);

-- More Events
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Kuwait International Book Fair',
  'Annual literary event featuring publishers from around the world.',
  'Events',
  'Kuwait International Fair Ground',
  ARRAY['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Book Sales', 'Author Meetings', 'Cultural Activities']
),
(
  'Food Truck Festival',
  'Weekend food festival featuring local and international cuisine.',
  'Events',
  'Marina Crescent',
  ARRAY['https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Food Trucks', 'Live Music', 'Family Entertainment']
);

-- More Kids Activities
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Little Gym Kuwait',
  'Children''s physical development center with structured activities.',
  'Kids Activity',
  'Salmiya',
  ARRAY['https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Gymnastics', 'Dance', 'Parent-Child Classes']
),
(
  'Cartoon Network World',
  'Indoor theme park featuring popular cartoon characters.',
  'Kids Activity',
  'The Avenues Mall',
  ARRAY['https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?w=800&h=600&fit=crop'],
  4.4,
  ARRAY['Character Meet & Greet', 'Interactive Games', 'Birthday Packages']
);

-- More Summer Activities
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
);

-- More Winter Activities
INSERT INTO places (name, description, category, address, images, rating, features, seasonal) VALUES
(
  'Green Island',
  'Artificial island with winter gardens and walking paths.',
  'Entertainment',
  'Arabian Gulf Street',
  ARRAY['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop'],
  4.6,
  ARRAY['Gardens', 'Walking Trails', 'Cafes'],
  'winter'
),
(
  'Winter Wonderland',
  'Seasonal festival with winter-themed activities and entertainment.',
  'Events',
  '360 Mall External Area',
  ARRAY['https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&h=600&fit=crop'],
  4.5,
  ARRAY['Ice Skating', 'Winter Market', 'Live Shows'],
  'winter'
);