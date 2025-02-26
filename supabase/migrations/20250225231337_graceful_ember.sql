/*
  # Fix get_saved_place function

  1. Changes
    - Fix ambiguous id column reference
    - Clarify column selection in function
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_saved_place;

-- Create function with fixed column reference
CREATE OR REPLACE FUNCTION get_saved_place(place_id_param uuid, user_id_param uuid)
RETURNS TABLE (
  saved_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT saved_places.id as saved_id
  FROM saved_places
  WHERE place_id = place_id_param
  AND user_id = user_id_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;