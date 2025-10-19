import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Check, X, ChevronDown, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Ali Muzar",
    date: "Posted on 24/04/2025, 12:42 AM",
    rating: 4,
    text: "I have been there many times.Rooms ,Food and Service are excellent,we did lots of Excursions and all the places are from the Hotel reachable, we visited Long Waterfall and was very helpful and excellent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali"
  },
  {
    name: "Keanu Repes",
    date: "Posted on 24/04/2025, 12:42 AM",
    rating: 2,
    text: "I have been there many times.Rooms ,Food and Service are excellent,we did lots of Excursions and all the places are from the Hotel reachable, we visited Long Waterfall and was very helpful and excellent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Keanu"
  },
  {
    name: "Chintya Clara",
    date: "Posted on 24/04/2025, 12:42 AM",
    rating: 3,
    text: "I have been there many times.Rooms ,Food and Service are excellent,we did lots of Excursions and all the places are from the Hotel reachable, we visited Long Waterfall and was very helpful and excellent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chintya"
  },
];

export function CustomerReviews() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Latest Customer Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{review.text}</p>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-green-400 hover:bg-success/90 rounded-full h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" className="rounded-full h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full">
          See more<ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
