/*
  # Fix reviews schema and add sample data

  1. Changes
    - Create sample user for reviews
    - Add sample reviews with valid user
    - Add function for fetching reviews with user data

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity
*/

-- Create a sample user in auth.users if it doesn't exist
INSERT INTO auth.users (id, email)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sample@example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Create user profile for the sample user
INSERT INTO public.users (id, username, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Sample User',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
) ON CONFLICT (id) DO UPDATE 
SET username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url;

-- Add sample reviews
INSERT INTO reviews (place_id, user_id, rating, content, created_at)
SELECT 
  p.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  5,
  'Amazing views of the city and Gulf! The rotating observation deck offers a unique perspective. The restaurant serves excellent food with a view to match.',
  now() - interval '2 days'
FROM places p
WHERE p.name = 'Kuwait Towers'
AND NOT EXISTS (
  SELECT 1 FROM reviews r 
  WHERE r.place_id = p.id 
  AND r.user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

INSERT INTO reviews (place_id, user_id, rating, content, created_at)
SELECT 
  p.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  4,
  'Authentic Kuwaiti atmosphere and delicious traditional coffee. The outdoor seating area is perfect during cooler months.',
  now() - interval '1 day'
FROM places p
WHERE p.name = 'Al Mubarakiya Cafe'
AND NOT EXISTS (
  SELECT 1 FROM reviews r 
  WHERE r.place_id = p.id 
  AND r.user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

INSERT INTO reviews (place_id, user_id, rating, content, created_at)
SELECT 
  p.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  5,
  'The best shopping experience in Kuwait! Great selection of brands and the food court has something for everyone.',
  now() - interval '3 days'
FROM places p
WHERE p.name = 'The Avenues Mall'
AND NOT EXISTS (
  SELECT 1 FROM reviews r 
  WHERE r.place_id = p.id 
  AND r.user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

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
$$ LANGUAGE plpgsql
SECURITY DEFINER;