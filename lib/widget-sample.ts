import type { Place } from "./places";

/** Deliberately fictional data used only by the builder preview and site demos. */
export const samplePlace: Place = {
  id: "fictional-demo-business",
  googleMapsUri: "https://www.google.com/maps",
  displayName: { text: "Oak & Maple Dental" },
  formattedAddress: "Austin, Texas · Sample business",
  rating: 4.9,
  userRatingCount: 1284,
  reviews: [
    {
      rating: 5,
      authorAttribution: { displayName: "Sarah Mitchell" },
      relativePublishTimeDescription: "2 days ago",
      visitDate: { year: 2026, month: 9 },
      isLocalGuide: true,
      photoUrls: [
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=260&fit=crop",
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=260&fit=crop",
      ],
      text: {
        text: "Finally, a dentist I actually look forward to visiting. The team made me feel at home from the moment I walked in. Thoughtful care, without the rush.",
      },
    },
    {
      rating: 5,
      authorAttribution: { displayName: "James Robinson" },
      relativePublishTimeDescription: "1 week ago",
      visitDate: { year: 2026, month: 8 },
      isLocalGuide: false,
      text: {
        text: "They explained every step, answered all my questions, and made the whole experience so easy. This is what great care should feel like.",
      },
    },
    {
      rating: 5,
      authorAttribution: { displayName: "Emily Wilson" },
      relativePublishTimeDescription: "2 weeks ago",
      visitDate: { year: 2026, month: 8 },
      isLocalGuide: true,
      photoUrls: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=260&fit=crop",
      ],
      text: {
        text: "So glad we found this place. You can tell they genuinely care about their patients. Our whole family comes here now.",
      },
    },
    {
      rating: 4,
      authorAttribution: { displayName: "Michael Chen" },
      relativePublishTimeDescription: "3 weeks ago",
      visitDate: { year: 2026, month: 7 },
      isLocalGuide: false,
      text: {
        text: "Clean space, kind staff, and zero pressure. Booking was simple and they stayed on schedule the whole visit.",
      },
    },
    {
      rating: 3,
      authorAttribution: { displayName: "Priya Patel" },
      relativePublishTimeDescription: "1 month ago",
      visitDate: { year: 2026, month: 7 },
      isLocalGuide: true,
      text: {
        text: "Warm welcome and clear explanations. My daughter was nervous and they handled it beautifully. Waiting room could be quieter.",
      },
    },
  ],
};
