import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";

interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
  onBook: (hotelId: string) => void;
}

const HotelCard = ({
  id,
  name,
  description,
  location,
  city,
  state,
  rating,
  pricePerNight,
  amenities,
  imageUrl,
  onBook,
}: HotelCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="font-semibold text-sm">{rating}</span>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm gap-1 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{city}, {state}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {amenities.slice(0, 4).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {amenities.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{amenities.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-3xl font-bold text-primary">₹{pricePerNight.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground ml-2">/night</span>
          </div>
          <Button onClick={() => onBook(id)} className="bg-gradient-to-r from-primary to-primary/80">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
