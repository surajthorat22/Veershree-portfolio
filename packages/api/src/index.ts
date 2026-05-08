import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const projectStatus = z.union([z.literal("Open"), z.literal("Few Left"), z.literal("Sold Out")]);

const project = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  location: z.string(),
  tagline: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  image: z.string(),
  priceFrom: z.string(),
  size: z.string(),
  status: projectStatus,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const upsertProject = z.object({
  slug: z.string().optional(),
  name: z.string(),
  location: z.string(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
  priceFrom: z.string().optional(),
  size: z.string().optional(),
  status: projectStatus.optional(),
});

const enquiry = z.object({
  id: z.string(),
  name: z.string(),
  mobile: z.string(),
  location: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

const createEnquiry = z.object({
  name: z.string().optional(),
  mobile: z.string(),
  location: z.string().optional(),
  message: z.string().optional(),
});

const dashboard = z.object({
  totalProjects: z.number().int().nonnegative(),
  totalEnquiries: z.number().int().nonnegative(),
  visitors7d: z.number().int().nonnegative(),
  conversionRate: z.number().nonnegative(),
  recentProjects: z.array(project),
});

export const contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/health",
    responses: {
      200: z.literal("OK"),
    },
  },
  getDashboard: {
    method: "GET",
    path: "/admin/dashboard",
    responses: {
      200: dashboard,
    },
  },
  listProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: z.array(project),
    },
  },
  getProject: {
    method: "GET",
    path: "/projects/:slug",
    responses: {
      200: project,
      404: z.object({ message: z.string() }),
    },
  },
  createProject: {
    method: "POST",
    path: "/projects",
    body: upsertProject,
    responses: {
      200: project,
    },
  },
  updateProject: {
    method: "PUT",
    path: "/projects/:slug",
    body: upsertProject,
    responses: {
      200: project,
      404: z.object({ message: z.string() }),
    },
  },
  deleteProject: {
    method: "DELETE",
    path: "/projects/:slug",
    responses: {
      200: z.object({ ok: z.literal(true) }),
      404: z.object({ message: z.string() }),
    },
  },
  listLeads: {
    method: "GET",
    path: "/leads",
    responses: {
      200: z.array(enquiry),
    },
  },
  createLead: {
    method: "POST",
    path: "/leads",
    body: createEnquiry,
    responses: {
      200: enquiry,
    },
  },
  deleteLead: {
    method: "DELETE",
    path: "/leads/:id",
    responses: {
      200: z.object({ ok: z.literal(true) }),
      404: z.object({ message: z.string() }),
    },
  },
});

export type AppContract = typeof contract;
