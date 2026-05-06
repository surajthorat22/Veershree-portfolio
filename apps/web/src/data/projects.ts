import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

export type Project = {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  priceFrom: string;
  size: string;
  status: "Open" | "Few Left" | "Sold Out";
};

export const projects: Project[] = [
  {
    id: "verdant-meadows",
    name: "Verdant Meadows",
    location: "Chakan, Pune",
    tagline: "Gated estate plots near the international airport",
    description:
      "An impeccably planned community of 240 premium plots wrapped in landscaped boulevards, just 12 minutes from Kempegowda International Airport.",
    features: ["40-ft black-top roads", "Underground utilities", "Clubhouse & spa", "Clear DTCP titles"],
    image: p1,
    priceFrom: "₹ 78 L",
    size: "1,200 – 3,600 sq ft",
    status: "Few Left",
  },
  {
    id: "highland-reserve",
    name: "Highland Reserve",
    location: "Chakan, Pune",
    tagline: "Hillside parcels overlooking coffee estates",
    description:
      "Discreet, contoured plots set across 92 acres of forested ridges. A retreat designed for second homes and discerning long-term investors.",
    features: ["Panoramic ridge views", "Spring-fed water table", "Forest buffer", "Concierge build services"],
    image: p2,
    priceFrom: "₹ 1.2 Cr",
    size: "5,000 – 12,000 sq ft",
    status: "Open",
  },
  {
    id: "riverine-isles",
    name: "Riverine Isles",
    location: "Chakan, Pune",
    tagline: "Waterfront plots on a private inland lagoon",
    description:
      "A rare collection of waterfront plots framed by palm groves and a navigable lagoon, minutes from the East Coast Road belt.",
    features: ["Waterfront frontage", "Palm-lined promenades", "Marina access", "RERA approved"],
    image: p3,
    priceFrom: "₹ 95 L",
    size: "2,400 – 6,000 sq ft",
    status: "Open",
  },
];
