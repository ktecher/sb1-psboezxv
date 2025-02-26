/*
  # Add Social Features and Notifications

  1. New Tables
    - follows (user following relationships)
    - notifications (user notifications)
    - user_activities (user activity feed)
    - likes (review likes)
    - comments (review comments)

  2. Functions
    - get_user_stats (followers, following, reviews count)
    - get_user_feed (user activity feed)

  3. Security
    - RLS policies for all new tables
    - Secure function access
*/

-- Create follows table
CREATE TABLE follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('follow', 'review', 'plan', 'like')),
  data jsonb NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_activities table
CREATE TABLE user_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('review', 'plan', 'save')),
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create likes table
CREATE TABLE likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Create comments table
CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Users can see their own follows"
  ON follows FOR SELECT
  TO authenticated
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- RLS Policies for notifications
CREATE POLICY "Users can see their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_activities
CREATE POLICY "Activities are viewable by everyone"
  ON user_activities FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param uuid)
RETURNS TABLE (
  followers_count bigint,
  following_count bigint,
  reviews_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM follows WHERE following_id = user_id_param),
    (SELECT COUNT(*) FROM follows WHERE follower_id = user_id_param),
    (SELECT COUNT(*) FROM reviews WHERE user_id = user_id_param);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Create function to get user feed
CREATE OR REPLACE FUNCTION get_user_feed(user_id_param uuid, limit_param integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  type text,
  user_id uuid,
  username text,
  avatar_url text,
  place_id uuid,
  place_name text,
  place_image text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ua.id,
    ua.type,
    u.id as user_id,
    u.username,
    u.avatar_url,
    p.id as place_id,
    p.name as place_name,
    p.images[1] as place_image,
    ua.created_at
  FROM user_activities ua
  JOIN users u ON ua.user_id = u.id
  JOIN places p ON ua.place_id = p.id
  WHERE ua.user_id IN (
    SELECT following_id
    FROM follows
    WHERE follower_id = user_id_param
  )
  ORDER BY ua.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Create trigger for updating comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();