export type ProjectStatusDto = "Open" | "Few Left" | "Sold Out";

export type ProjectDto = {
  id: string;
  slug: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  priceFrom: string;
  size: string;
  status: ProjectStatusDto;
  createdAt: string;
  updatedAt: string;
};

