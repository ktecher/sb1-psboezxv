-- Create function to safely get saved places
CREATE OR REPLACE FUNCTION get_saved_place(place_id_param uuid, user_id_param uuid)
RETURNS TABLE (
  id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT id
  FROM saved_places
  WHERE place_id = place_id_param
  AND user_id = user_id_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;