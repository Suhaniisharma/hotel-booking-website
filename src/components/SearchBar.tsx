import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (location: string, checkIn: string, checkOut: string, guests: number) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    onSearch(location, checkIn, checkOut, guests);
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 backdrop-blur-sm border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location
          </label>
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-border/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border-border/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border-border/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Guests
          </label>
          <Input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="border-border/50"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSearch}
        className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
        size="lg"
      >
        <Search className="w-5 h-5 mr-2" />
        Search Hotels
      </Button>
    </div>
  );
};

export default SearchBar;
