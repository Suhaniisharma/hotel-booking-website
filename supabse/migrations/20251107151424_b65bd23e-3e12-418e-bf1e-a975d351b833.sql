-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  price_per_night INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  total_rooms INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  rooms INTEGER NOT NULL CHECK (rooms > 0),
  total_price INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hotels (public read)
CREATE POLICY "Hotels are viewable by everyone"
  ON public.hotels FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample hotels
INSERT INTO public.hotels (name, description, location, city, state, rating, price_per_night, amenities, image_url) VALUES
  ('Taj Lake Palace', 'Luxury heritage hotel floating on Lake Pichola with stunning views and royal architecture', 'Lake Pichola', 'Udaipur', 'Rajasthan', 4.9, 35000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Room Service', 'Concierge'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'),
  ('The Oberoi Amarvilas', 'Luxurious resort with breathtaking views of the Taj Mahal from every room', 'Taj East Gate Road', 'Agra', 'Uttar Pradesh', 4.8, 45000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
  ('Wildflower Hall', 'Elegant mountain resort in the Himalayas offering spectacular valley views', 'Chharabra', 'Shimla', 'Himachal Pradesh', 4.7, 28000, ARRAY['WiFi', 'Spa', 'Restaurant', 'Gym', 'Trekking', 'Heating'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
  ('Taj Mahal Palace', 'Iconic heritage hotel overlooking the Gateway of India with legendary hospitality', 'Apollo Bunder', 'Mumbai', 'Maharashtra', 4.8, 32000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
  ('The Leela Palace', 'Opulent palace hotel blending traditional charm with modern luxury', 'Adyar Seaface', 'Chennai', 'Tamil Nadu', 4.7, 22000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach Access'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'),
  ('Rambagh Palace', 'Former royal residence turned luxury hotel with exquisite gardens', 'Bhawani Singh Road', 'Jaipur', 'Rajasthan', 4.9, 38000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gardens', 'Heritage Tours'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
  ('Vivanta by Taj', 'Contemporary hotel offering scenic backwater views and Ayurvedic treatments', 'Punnamada Lake', 'Alappuzha', 'Kerala', 4.6, 18000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Ayurveda', 'Boating'], 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'),
  ('ITC Grand Goa Resort', 'Beachfront luxury resort with Portuguese-inspired architecture', 'Arossim Beach', 'Goa', 'Goa', 4.7, 24000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach', 'Water Sports'], 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800');