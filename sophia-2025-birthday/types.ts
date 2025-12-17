export interface PartyDetails {
  childName: string;
  age: number;
  date: string;
  time: string;
  locationName: string;
  address: string;
  rsvpLink: string;
  welcomeMessage: string;
  theme: string;
  galleryImages: string[];
}

export const DEFAULT_DETAILS: PartyDetails = {
  childName: "Sophie",
  age: 7,
  date: "2025-12-27",
  time: "12:30",
  locationName: "Chuck E Cheese",
  address: "750 Sunrise Highway, Valley Stream, 11581. phone: (516) 234-5535",
  rsvpLink: "https://docs.google.com/forms/",
  welcomeMessage: "Join us for a magical afternoon filled with unicorns, rainbows, and cake! We can't wait to celebrate with you.",
  theme: "Unicorns & Rainbows",
  galleryImages: [
    "https://photos.google.com/share/AF1QipM-JwG8ijYTeBWhj_hm6d5AyczBXGxx_geRmgI4WOgGfvstu1LfO8ffduAdoa6I6g/photo/AF1QipP3qI_NAYA8q_v0mK0SQPAgTECRIQwJFYGQj3bO?key=VWNPQ3ZORzhLTHNHeFFIUXEyRWJxY0RUZnBDY05B",
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502086223501-413b1d420603?q=80&w=800&auto=format&fit=crop",
  ]
};