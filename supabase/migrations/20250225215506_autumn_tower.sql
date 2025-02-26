/*
  # Recreate Places Table

  1. Changes
    - Drop existing places table and related tables
    - Recreate places table with optimized structure
    - Add sample data for Kuwait travel guide
    
  2. Security
    - Enable RLS
    - Add policies for public read access
*/

-- Drop existing tables that depend on places
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS saved_places CASCADE;
DROP TABLE IF EXISTS places CASCADE;

-- Create places table
CREATE TABLE places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  address text,
  images text[],
  rating numeric DEFAULT 0,
  features text[],
  seasonal text CHECK (seasonal IN ('summer', 'winter', null)),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Places are viewable by everyone"
  ON places FOR SELECT
  USING (true);

-- Insert sample data
INSERT INTO places (name, description, category, address, images, rating, features) VALUES
(
  'Kuwait Towers',
  'Iconic symbol of Kuwait featuring observation deck and restaurants with panoramic views of the Arabian Gulf.',
  'Cultural Sites',
  'Arabian Gulf Street, Kuwait City',
  ARRAY['https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'],
  4.9,
  ARRAY['Observation Deck', 'Restaurant', 'Historic Landmark']
),
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
  'The Avenues Mall',
  'Kuwait''s largest shopping mall featuring international brands, dining, and entertainment.',
  'Shopping',
  'Al-Rai, 5th Ring Road',
  ARRAY['https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Luxury Brands', 'Food Court', 'Cinema', 'Parking']
),
(
  'Scientific Center Kuwait',
  'Interactive science museum with aquarium and IMAX theater.',
  'Kids Activity',
  'Gulf Road, Salmiya',
  ARRAY['https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800&h=600&fit=crop'],
  4.7,
  ARRAY['Aquarium', 'IMAX Theater', 'Educational Programs']
);

-- Add seasonal activities
INSERT INTO places (name, description, category, address, images, rating, features, seasonal) VALUES
(
  'Aqua Park Kuwait',
  'Largest water park in Kuwait with exciting slides and pools.',
  'Entertainment',
  'Arab Gulf Street',
  ARRAY['https://images.unsplash.com/photo-1533163857297-f96720ae4d58?w=800&h=600&fit=crop'],
  4.3,
  ARRAY['Water Slides', 'Swimming Pools', 'Family Friendly'],
  'summer'
),
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

-- Recreate dependent tables
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE saved_places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, place_id)
);

-- Enable RLS for dependent tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Add policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add policies for saved places
CREATE POLICY "Users can view own saved places"
  ON saved_places FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save places"
  ON saved_places FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved places"
  ON saved_places FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);