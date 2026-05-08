import type { ProjectStatusDto } from "./projects.types";

export type UpsertProjectDto = {
  slug?: string;
  name: string;
  location: string;
  tagline?: string;
  description?: string;
  features?: string[];
  image?: string;
  priceFrom?: string;
  size?: string;
  status?: ProjectStatusDto;
};

