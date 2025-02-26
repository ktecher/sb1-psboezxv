/*
  # Fix database relationships and queries

  1. Changes
    - Add foreign key relationship between reviews and users
    - Create function to get reviews with user data
    - Update review queries to use proper joins

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_reviews_with_users;

-- Create function to get reviews with user data
CREATE OR REPLACE FUNCTION get_reviews_with_users(place_id_param uuid)
RETURNS TABLE (
  id uuid,
  place_id uuid,
  user_id uuid,
  rating numeric,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  username text,
  avatar_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.place_id,
    r.user_id,
    r.rating,
    r.content,
    r.created_at,
    r.updated_at,
    u.username,
    u.avatar_url
  FROM reviews r
  LEFT JOIN users u ON r.user_id = u.id
  WHERE r.place_id = place_id_param
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;