/*
  # Initial Schema Setup

  1. Tables
    - users
      - id (uuid, matches auth.users)
      - username (text)
      - avatar_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - places
      - id (uuid)
      - name (text)
      - description (text)
      - category (text)
      - address (text)
      - coordinates (point)
      - images (text[])
      - rating (numeric)
      - opening_hours (jsonb)
      - contact_info (jsonb)
      - created_at (timestamp)
      - seasonal (text)
      - features (text[])
      - user_id (uuid, references users)

    - reviews
      - id (uuid)
      - place_id (uuid)
      - user_id (uuid)
      - rating (numeric)
      - content (text)
      - created_at (timestamp)
      - updated_at (timestamp)

    - saved_places
      - id (uuid)
      - user_id (uuid)
      - place_id (uuid)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies for each table
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Places table
CREATE TABLE IF NOT EXISTS places (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  address text,
  coordinates point,
  images text[],
  rating numeric DEFAULT 0,
  opening_hours jsonb,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  seasonal text CHECK (seasonal IN ('summer', 'winter', null)),
  features text[],
  user_id uuid REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Saved places table
CREATE TABLE IF NOT EXISTS saved_places (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, place_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for places table
CREATE POLICY "Places are viewable by everyone"
  ON places FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert places"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own places"
  ON places FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reviews table
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for saved_places table
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();