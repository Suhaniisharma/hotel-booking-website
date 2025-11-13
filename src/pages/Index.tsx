import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { Hotel, MapPin, Users, Shield } from "lucide-react";

const Index = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .order("rating", { ascending: false });

    if (data) {
      setHotels(data);
      setFilteredHotels(data);
    }
  };

  const handleSearch = (location: string, checkIn: string, checkOut: string, guests: number) => {
    if (location) {
      const filtered = hotels.filter((hotel) =>
        hotel.city.toLowerCase().includes(location.toLowerCase()) ||
        hotel.state.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  };

  const handleBook = (hotelId: string) => {
    navigate(`/booking/${hotelId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Incredible India
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book luxury hotels across India's most beautiful destinations
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Hotel className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-semibold mb-1">500+ Premium Hotels</h3>
              <p className="text-sm text-muted-foreground">Handpicked luxury properties</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-secondary mb-3" />
              <h3 className="font-semibold mb-1">50+ Destinations</h3>
              <p className="text-sm text-muted-foreground">Across India</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-accent mb-3" />
              <h3 className="font-semibold mb-1">Secure Booking</h3>
              <p className="text-sm text-muted-foreground">100% safe and protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Featured Hotels
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                name={hotel.name}
                description={hotel.description}
                location={hotel.location}
                city={hotel.city}
                state={hotel.state}
                rating={hotel.rating}
                pricePerNight={hotel.price_per_night}
                amenities={hotel.amenities}
                imageUrl={hotel.image_url}
                onBook={handleBook}
              />
            ))}
          </div>

          {filteredHotels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hotels found. Try a different search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
