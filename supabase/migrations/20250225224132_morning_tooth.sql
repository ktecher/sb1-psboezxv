/*
  # Add Plans Feature Tables

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `plan_items`
      - `id` (uuid, primary key)
      - `plan_id` (uuid, references plans)
      - `place_id` (uuid, references places)
      - `scheduled_for` (timestamptz)
      - `duration_minutes` (integer)
      - `order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own plans
*/

-- Create plans table
CREATE TABLE plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plan items table
CREATE TABLE plan_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_items_updated_at
  BEFORE UPDATE ON plan_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for plans
CREATE POLICY "Users can view own plans"
  ON plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create plans"
  ON plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans"
  ON plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
  ON plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add RLS policies for plan items
CREATE POLICY "Users can view own plan items"
  ON plan_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM plans
    WHERE plans.id = plan_items.plan_id
    AND plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create plan items"
  ON plan_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM plans
    WHERE plans.id = plan_items.plan_id
    AND plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own plan items"
  ON plan_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM plans
    WHERE plans.id = plan_items.plan_id
    AND plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own plan items"
  ON plan_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM plans
    WHERE plans.id = plan_items.plan_id
    AND plans.user_id = auth.uid()
  ));