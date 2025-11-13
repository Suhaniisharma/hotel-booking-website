import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Calendar, Users, Loader2 } from "lucide-react";

const BookingPage = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", hotelId)
        .single();

      if (error) throw error;
      setHotel(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load hotel details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !hotel) return 0;
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return nights * hotel.price_per_night * rooms;
  };

  const handleBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: "Missing information",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: session.user.id,
        hotel_id: hotelId,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests,
        rooms,
        total_price: calculateTotal(),
        special_requests: specialRequests,
        status: "confirmed",
      });

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: "Your booking has been successfully created",
      });
      navigate("/bookings");
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={hotel.image_url}
              alt={hotel.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="mt-6">
              <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-muted-foreground mb-4">{hotel.location}, {hotel.city}, {hotel.state}</p>
              <p className="text-foreground mb-6">{hotel.description}</p>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity: string) => (
                  <span key={amenity} className="px-3 py-1 bg-muted rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <span className="text-4xl font-bold text-primary">₹{hotel.price_per_night.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-2">/night</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Check-in
                      </Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Check-out
                      </Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guests" className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Guests
                      </Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        min="1"
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requests or preferences..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={booking || !checkIn || !checkOut}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  size="lg"
                >
                  {booking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
