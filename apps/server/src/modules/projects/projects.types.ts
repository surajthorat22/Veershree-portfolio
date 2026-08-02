export type ProjectStatusDto = "Open" | "Few Left" | "Sold Out" | "Coming Soon";

// Prisma (MongoDB) enum identifiers live without spaces: Open, FewLeft, SoldOut, ComingSoon.
// We keep the DTO/API status human-readable for UI, and map explicitly at the boundary.
export type ProjectStatusDb = "Open" | "FewLeft" | "SoldOut" | "ComingSoon";

export function toDbProjectStatus(status: ProjectStatusDto | undefined): ProjectStatusDb | undefined {
  if (!status) return undefined;
  if (status === "Few Left") return "FewLeft";
  if (status === "Sold Out") return "SoldOut";
  if (status === "Coming Soon") return "ComingSoon";
  return "Open";
}

export function fromDbProjectStatus(status: ProjectStatusDb): ProjectStatusDto {
  if (status === "FewLeft") return "Few Left";
  if (status === "SoldOut") return "Sold Out";
  if (status === "ComingSoon") return "Coming Soon";
  return "Open";
}

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
